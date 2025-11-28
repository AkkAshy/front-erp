import { useReferralDashboard } from "@/entities/referral";

import PageTitle from "@/shared/ui/PageTitle";
import styles from "./ReferralDashboard.module.scss";

const ReferralDashboard = () => {
  const dashboard = useReferralDashboard();

  if (dashboard.isLoading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loading}>Yuklanmoqda...</div>
      </div>
    );
  }

  if (dashboard.isError) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.error}>
          <p>Xatolik yuz berdi</p>
          <button onClick={() => dashboard.refetch()}>Qayta yuklash</button>
        </div>
      </div>
    );
  }

  const data = dashboard.data;
  if (!data) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.error}>
          <p>Ma'lumotlar topilmadi</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <PageTitle>Mening dashboardim</PageTitle>
        <div className={styles.welcomeText}>
          Salom, <strong>{data.name}</strong>!
        </div>
      </header>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: "#dcfce7" }}>
            💰
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue} style={{ color: "#22c55e" }}>
              {parseFloat(data.balance).toLocaleString("de-DE")} uzs
            </span>
            <span className={styles.statLabel}>Joriy balans</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: "#e0e7ff" }}>
            📊
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>
              {parseFloat(data.total_earned).toLocaleString("de-DE")} uzs
            </span>
            <span className={styles.statLabel}>Jami daromad</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: "#fef3c7" }}>
            🏆
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>
              {data.total_sales_count} ta
            </span>
            <span className={styles.statLabel}>Jami sotuvlar</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: "#fce7f3" }}>
            💵
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>
              {parseFloat(data.total_paid).toLocaleString("de-DE")} uzs
            </span>
            <span className={styles.statLabel}>Jami to'langan</span>
          </div>
        </div>
      </div>

      {/* Commission Rate */}
      <div className={styles.commissionCard}>
        <span>Sizning komissiya stavkangiz:</span>
        <strong>{parseFloat(data.commission_percent)}%</strong>
      </div>

      {/* Coupons Section */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Mening kuponlarim</h3>
        <div className={styles.couponsGrid}>
          {data.coupons.map((coupon) => (
            <div key={coupon.id} className={styles.couponCard}>
              <div className={styles.couponHeader}>
                <span className={styles.couponCode}>{coupon.code}</span>
                <span
                  className={styles.couponStatus}
                  style={{
                    backgroundColor: coupon.is_active ? "#dcfce7" : "#fee2e2",
                    color: coupon.is_active ? "#166534" : "#991b1b",
                  }}
                >
                  {coupon.is_active ? "Faol" : "Nofaol"}
                </span>
              </div>
              <div className={styles.couponInfo}>
                <p>
                  <span>Turi:</span>{" "}
                  {coupon.coupon_type === "both"
                    ? "Chegirma + Bonus"
                    : coupon.coupon_type === "discount"
                    ? "Faqat chegirma"
                    : "Faqat bonus"}
                </p>
                <p>
                  <span>Chegirma:</span>{" "}
                  {coupon.discount_type === "percent"
                    ? `${parseFloat(coupon.discount_value)}%`
                    : `${parseFloat(coupon.discount_value).toLocaleString("de-DE")} uzs`}
                </p>
                <p>
                  <span>Ishlatilgan:</span> {coupon.usage_count} marta
                </p>
                {coupon.total_sales_amount && (
                  <p>
                    <span>Jami sotuv:</span>{" "}
                    {parseFloat(coupon.total_sales_amount).toLocaleString("de-DE")} uzs
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        {data.coupons.length === 0 && (
          <p className={styles.emptyText}>Sizda hali kuponlar yo'q</p>
        )}
      </div>

      {/* Recent Earnings */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>So'nggi daromadlar</h3>
        <div className={styles.transactionsList}>
          {data.recent_earnings.map((earning) => (
            <div key={earning.id} className={styles.transactionItem}>
              <div className={styles.transactionLeft}>
                <span className={styles.transactionIcon} style={{ backgroundColor: "#dcfce7" }}>
                  ↗
                </span>
                <div className={styles.transactionInfo}>
                  <span className={styles.transactionTitle}>
                    Sotuv #{earning.sale}
                  </span>
                  <span className={styles.transactionDate}>
                    {new Date(earning.created_at).toLocaleDateString("uz-UZ", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
              <div className={styles.transactionRight}>
                <span className={styles.transactionAmount} style={{ color: "#22c55e" }}>
                  +{parseFloat(earning.commission_amount).toLocaleString("de-DE")} uzs
                </span>
                <span className={styles.transactionMeta}>
                  {parseFloat(earning.commission_percent)}% dan {parseFloat(earning.sale_amount).toLocaleString("de-DE")} uzs
                </span>
              </div>
            </div>
          ))}
          {data.recent_earnings.length === 0 && (
            <p className={styles.emptyText}>Hali daromadlar yo'q</p>
          )}
        </div>
      </div>

      {/* Recent Payouts */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>So'nggi to'lovlar</h3>
        <div className={styles.transactionsList}>
          {data.recent_payouts.map((payout) => (
            <div key={payout.id} className={styles.transactionItem}>
              <div className={styles.transactionLeft}>
                <span className={styles.transactionIcon} style={{ backgroundColor: "#fef3c7" }}>
                  ↙
                </span>
                <div className={styles.transactionInfo}>
                  <span className={styles.transactionTitle}>
                    {payout.payment_method_display}
                  </span>
                  <span className={styles.transactionDate}>
                    {new Date(payout.created_at).toLocaleDateString("uz-UZ", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
              <div className={styles.transactionRight}>
                <span className={styles.transactionAmount} style={{ color: "#f59e0b" }}>
                  -{parseFloat(payout.amount).toLocaleString("de-DE")} uzs
                </span>
                {payout.notes && (
                  <span className={styles.transactionMeta}>{payout.notes}</span>
                )}
              </div>
            </div>
          ))}
          {data.recent_payouts.length === 0 && (
            <p className={styles.emptyText}>Hali to'lovlar yo'q</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferralDashboard;
