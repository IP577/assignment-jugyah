import { useEffect, useState, useRef } from "react";
import Box from "./Box/Box";
import _ from "lodash";
import "./styles.css";

export default function App() {
  const [isStateDisabled, setIsStateDisabled] = useState(false);
  const [schema, setSchema] = useState([
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
  ]);

  const preserveSchema = useRef(schema);
  const positions = useRef([]);

  useEffect(() => {
    setSchema((prev) => {
      const prevCopy = prev.map((row) => {
        return row.map((item) => {
          if (item === 0) {
            item = "N";
          }
          return item;
        });
      });
      preserveSchema.current = prevCopy;
      return prevCopy;
    });
  }, []);

  const checkAndPushPositions = (indexI, indexJ, value) => {
    const item = [indexI, indexJ];

    if (value === 0) {
      const existingIndex = positions.current.findIndex((array) =>
        _.isEqual(array, item)
      );

      if (existingIndex !== -1) {
        positions.current.splice(existingIndex, 1);
      }

      positions.current.push(item);
    }
  };

  const beginOperation = () => {
    setIsStateDisabled(true);

    let interval;
    const endOperation = () => {
      clearInterval(interval);
      setIsStateDisabled(false);
    };

    interval = setInterval(() => {
      if (positions.current.length) {
        let firstElement = positions.current.shift();

        // turn the first element green
        setSchema((prev) => {
          const prevCopy = _.cloneDeep(prev);
          prevCopy[firstElement[0]][firstElement[1]] = 1;
          // check if final matrix is same as initial matrix'
          if (isBackToInitial(prevCopy, preserveSchema.current)) {
            endOperation();
          }
          return prevCopy;
        });
      }
    }, 1000);
  };

  const handleClick = (id, value) => {
    if (isStateDisabled) {
      return;
    }

    // alter the value of given id
    const prevCopy = _.cloneDeep(schema);
    prevCopy[id[0]][id[1]] = value;

    checkAndPushPositions(id[0], id[1], value);

    // check if all boxes are white
    if (isEveryBoxWhite(prevCopy)) {
      beginOperation();
    }

    setSchema(prevCopy);
  };

  return (
    <div className="App">
      <ul>
        {schema.map((item, indexI) => (
          <li className="list_row" key={`row-${indexI}`} id={indexI}>
            {item.map((value, indexJ) => {
              const key = `cell-${indexI}-${indexJ}`;
              return (
                <li key={key}>
                  <Box
                    value={value}
                    onClick={handleClick}
                    id={[indexI, indexJ]}
                    disabled={isStateDisabled}
                  />
                </li>
              );
            })}
          </li>
        ))}
      </ul>
    </div>
  );
}

const isEveryBoxWhite = (matrix) => {
  return !matrix.some((i) => i.some((j) => j === 1));
};

const isBackToInitial = (matrix, initialMatrix) => {
  return _.isEqual(matrix, initialMatrix);
};
