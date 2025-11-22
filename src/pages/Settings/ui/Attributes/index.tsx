import { useState } from "react";
import CreateModal from "@/shared/ui/CreateModal";
import DashedButton from "@/shared/ui/DashedButton";
import Notification from "@/shared/ui/Notification";
import StoreSelector from "@/shared/ui/StoreSelector";
import { useAttributeTypes } from "@/entities/attribute/model/useAttributeTypes";
import { useCreateAttributeType } from "@/entities/attribute/model/useCreateAttributeType";
import { useAttributeValues } from "@/entities/attribute/model/useAttributeValues";
import { useCreateAttributeValue } from "@/entities/attribute/model/useCreateAttributeValue";
import { useDeleteAttributeValue } from "@/entities/attribute/model/useDeleteAttributeValue";

//scss
import styles from "./Attributes.module.scss";

const Attributes = () => {
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [attributeName, setAttributeName] = useState("");
  const [isFilterable, setIsFilterable] = useState(false);

  const [isOpenCreateValue, setIsOpenCreateValue] = useState(false);
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [valueName, setValueName] = useState("");
  const [valueOrdering, setValueOrdering] = useState("1");

  const [expandedTypeId, setExpandedTypeId] = useState<number | null>(null);

  const attributeTypes = useAttributeTypes({ limit: 100 });
  const createAttributeType = useCreateAttributeType();
  const createAttributeValue = useCreateAttributeValue();
  const deleteAttributeValue = useDeleteAttributeValue();

  // Fetch values for expanded attribute type
  const attributeValues = useAttributeValues({
    attribute: expandedTypeId ?? undefined, // Изменено с attribute_type
    limit: 100,
  });

  const handleCreate = () => {
    if (!attributeName.trim()) {
      return;
    }

    createAttributeType
      .mutateAsync({
        name: attributeName,
        is_filterable: isFilterable,
      })
      .then((res) => {
        if (res.status === 201) {
          setIsOpenCreate(false);
          setAttributeName("");
          setIsFilterable(false);
        }
      })
      .catch((err) => console.log("error", err));
  };

  const handleCreateValue = () => {
    if (!valueName.trim() || !selectedTypeId) {
      return;
    }

    createAttributeValue
      .mutateAsync({
        attribute: selectedTypeId, // Изменено с attribute_type
        value: valueName,
        order: parseInt(valueOrdering) || 0, // Изменено с ordering
      })
      .then((res) => {
        if (res.status === 201) {
          setIsOpenCreateValue(false);
          setValueName("");
          setValueOrdering("0");
          setSelectedTypeId(null);
        }
      })
      .catch((err) => console.log("error", err));
  };

  const handleDeleteValue = (valueId: number) => {
    if (confirm("Удалить это значение атрибута?")) {
      deleteAttributeValue.mutate(valueId);
    }
  };

  const toggleExpand = (typeId: number) => {
    if (expandedTypeId === typeId) {
      setExpandedTypeId(null);
    } else {
      setExpandedTypeId(typeId);
    }
  };

  const openCreateValueModal = (typeId: number) => {
    setSelectedTypeId(typeId);
    setIsOpenCreateValue(true);
  };

  return (
    <div className={styles.attributes}>
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h2>Атрибуты товаров</h2>
          <StoreSelector />
        </div>
      </div>

      <div className={styles.addButtonWrapper}>
        <DashedButton onClick={() => setIsOpenCreate(true)}>
          Добавить атрибут
        </DashedButton>
      </div>

      <div className={styles.attributesList}>
        {attributeTypes.data?.data?.results?.map((type: any) => (
          <div key={type.id} className={styles.attributeCard}>
            <div className={styles.attributeHeader}>
              <div className={styles.attributeTitleRow}>
                <h3>{type.name}</h3>
                <button
                  className={styles.expandButton}
                  onClick={() => toggleExpand(type.id)}
                >
                  {expandedTypeId === type.id ? "▼" : "▶"}
                </button>
              </div>
              <span className={styles.slug}>{type.slug}</span>
              {type.is_filterable && (
                <span className={styles.filterableBadge}>Фильтруемый</span>
              )}
            </div>

            {expandedTypeId === type.id && (
              <div className={styles.valuesSection}>
                <div className={styles.valuesSectionHeader}>
                  <h4>Значения</h4>
                  <button
                    className={styles.addValueButton}
                    onClick={() => openCreateValueModal(type.id)}
                  >
                    + Добавить значение
                  </button>
                </div>

                <div className={styles.valuesList}>
                  {attributeValues.isLoading ? (
                    <div className={styles.loading}>Загрузка...</div>
                  ) : !attributeValues.data?.data?.results || attributeValues.data.data.results.length === 0 ? (
                    <div className={styles.emptyValues}>
                      Нет значений. Добавьте первое значение
                    </div>
                  ) : (
                    attributeValues.data.data.results.map((value: any) => (
                      <div key={value.id} className={styles.valueItem}>
                        <div className={styles.valueInfo}>
                          <span className={styles.valueName}>{value.value}</span>
                          <span className={styles.valueOrder}>Порядок: {value.order}</span>
                        </div>
                        <button
                          className={styles.deleteValueButton}
                          onClick={() => handleDeleteValue(value.id)}
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <CreateModal
        isOpen={isOpenCreate}
        onClose={() => setIsOpenCreate(false)}
        headTitle="Новый тип атрибута"
        btnTitle="Создать"
        btnClose={true}
        width={600}
        height={500}
        btnWidth="100%"
        btnHeight={64}
        btnOnClick={handleCreate}
      >
        <div className={styles.formGroup}>
          <label>Название</label>
          <input
            value={attributeName}
            onChange={(e) => setAttributeName(e.target.value)}
            type="text"
            placeholder="Например: Цвет, Размер, Материал"
          />
        </div>

        <div className={styles.checkboxGroup}>
          <label>
            <input
              type="checkbox"
              checked={isFilterable}
              onChange={(e) => setIsFilterable(e.target.checked)}
            />
            <span>Использовать для фильтрации</span>
          </label>
        </div>
      </CreateModal>

      <CreateModal
        isOpen={isOpenCreateValue}
        onClose={() => {
          setIsOpenCreateValue(false);
          setSelectedTypeId(null);
          setValueName("");
          setValueOrdering("1");
        }}
        headTitle="Новое значение атрибута"
        btnTitle="Создать"
        btnClose={true}
        width={600}
        height={450}
        btnWidth="100%"
        btnHeight={64}
        btnOnClick={handleCreateValue}
      >
        <div className={styles.formGroup}>
          <label>Название значения</label>
          <input
            value={valueName}
            onChange={(e) => setValueName(e.target.value)}
            type="text"
            placeholder="Например: Красный, Синий, Большой"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Порядок сортировки</label>
          <input
            value={valueOrdering}
            onChange={(e) => setValueOrdering(e.target.value)}
            type="number"
            placeholder="1"
          />
        </div>
      </CreateModal>

      <Notification
        type="success"
        message="Успешно"
        description="Тип атрибута создан"
        onOpen={createAttributeType.isSuccess}
      />

      <Notification
        type="error"
        message="Ошибка"
        description="Не удалось создать тип атрибута"
        onOpen={createAttributeType.isError}
      />

      <Notification
        type="success"
        message="Успешно"
        description="Значение атрибута создано"
        onOpen={createAttributeValue.isSuccess}
      />

      <Notification
        type="error"
        message="Ошибка"
        description="Не удалось создать значение атрибута"
        onOpen={createAttributeValue.isError}
      />

      <Notification
        type="success"
        message="Успешно"
        description="Значение атрибута удалено"
        onOpen={deleteAttributeValue.isSuccess}
      />

      <Notification
        type="error"
        message="Ошибка"
        description="Не удалось удалить значение атрибута"
        onOpen={deleteAttributeValue.isError}
      />
    </div>
  );
};

export default Attributes;
