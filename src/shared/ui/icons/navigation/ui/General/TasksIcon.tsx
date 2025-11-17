import type { IconProps } from "../../../types";

const TasksIcon = ({ className, selected }: IconProps) => {
  return (
    <>
      {selected ? (
        <svg
          className={className}
          width="38"
          height="38"
          viewBox="0 0 38 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M25.3333 4.75H12.6667C8.29166 4.75 5.54166 7.5 5.54166 11.875V29.2917C5.54166 33.4292 8.29166 36.4167 12.6667 36.4167H25.3333C29.7083 36.4167 32.4583 33.4292 32.4583 29.2917V11.875C32.4583 7.5 29.7083 4.75 25.3333 4.75ZM16.625 27.7083L11.0833 22.1667C10.4658 21.5492 10.4658 20.5517 11.0833 19.9342C11.7008 19.3167 12.6983 19.3167 13.3158 19.9342L17.7383 24.3567L24.6842 17.4108C25.3017 16.7933 26.2992 16.7933 26.9167 17.4108C27.5342 18.0283 27.5342 19.0258 26.9167 19.6433L18.8575 27.7025C18.24 28.32 17.2425 28.3358 16.625 27.7083Z"
            fill="#8E51FF"
          />
        </svg>
      ) : (
        <svg
          className={className}
          width="38"
          height="38"
          viewBox="0 0 38 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M25.3333 6.33325H12.6667C8.68166 6.33325 5.54166 8.76075 5.54166 13.4583V28.7083C5.54166 33.0041 8.68166 35.6249 12.6667 35.6249H25.3333C29.3183 35.6249 32.4583 33.0041 32.4583 28.7083V13.4583C32.4583 8.76075 29.3183 6.33325 25.3333 6.33325Z"
            stroke="#94A3B8"
            strokeWidth="2.375"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.6667 17.4166H19"
            stroke="#94A3B8"
            strokeWidth="2.375"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.6667 25.3333H25.3333"
            stroke="#94A3B8"
            strokeWidth="2.375"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </>
  );
};

export default TasksIcon;
