import Styles from "./Box.module.css";

const Box = (props) => {
  const { value, onClick, id } = props;

  return (
    <div
      className={`
        ${Styles.box} 
        ${value === "N" && Styles.box_notRender} 
        ${value === 1 && Styles.box_green}`}
      onClick={() => onClick(id, value === 0 ? 1 : 0)}
      key={id}
    >
      {value}
    </div>
  );
};

export default Box;
