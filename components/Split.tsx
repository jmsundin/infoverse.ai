import React, { Fragment, useState, useRef, useEffect } from "react";

function Split(props) {
  const {
    className,
    onMouseDown,
    onDragEnd,
    onDragging,
    renderBar,
    lineBar,
    visible = true,
    mode = "vertical",
    disable,
    children,
  } = props;

  const wrapperRef = useRef(null);
  const targetRef = useRef(null);

  const [dragging, setDragging] = useState(false);
  const [paneNumber, setPaneNumber] = useState(null);
  const [startX, setStartX] = useState(null);
  const [startY, setStartY] = useState(null);
  const [move, setMove] = useState(false);
  const [preWidth, setPreWidth] = useState(null);
  const [nextWidth, setNextWidth] = useState(null);
  const [preHeight, setPreHeight] = useState(null);
  const [nextHeight, setNextHeight] = useState(null);

  const [preSize, setPreSize] = useState(null);
  const [nextSize, setNextSize] = useState(null);

  useEffect(() => {
    const removeEvent = () => {
      window.removeEventListener("mousemove", onDragging);
      window.removeEventListener("mouseup", onDragEnd);
    };

    return () => removeEvent();
  }, []);

  return (
    <div ref={wrapperRef}>
      {React.Children.map(children, (element, index) => {
        const onMouseDown = (index, e) => {
          if (disable) return;
          setDragging(true);
          setPaneNumber(index);
          setStartX(e.clientX);
          setStartY(e.clientY);
          setPreWidth(
            wrapperRef.current.children[index - 1].getBoundingClientRect().width
          );
          setNextWidth(
            wrapperRef.current.children[index + 1].getBoundingClientRect().width
          );
          setPreHeight(
            wrapperRef.current.children[index - 1].getBoundingClientRect()
              .height
          );
          setNextHeight(
            wrapperRef.current.children[index + 1].getBoundingClientRect()
              .height
          );
          setPreSize(
            mode === "vertical"
              ? wrapperRef.current.children[index - 1].getBoundingClientRect()
                  .width
              : wrapperRef.current.children[index - 1].getBoundingClientRect()
                  .height
          );
          setNextSize(
            mode === "vertical"
              ? wrapperRef.current.children[index + 1].getBoundingClientRect()
                  .width
              : wrapperRef.current.children[index + 1].getBoundingClientRect()
                  .height
          );
          window.addEventListener("mousemove", onDragging);
          window.addEventListener("mouseup", onDragEnd);
        };

        const visibleBar =
          visible === true || (visible && visible.includes(index + 1)) || false;

        const bar = renderBar ? (
            renderBar(onMouseDown, className, visibleBar)
        ) : (
          <div
            className={className}
            onMouseDown={onMouseDown}
            style={{
              cursor: disable
                ? "default"
                : mode === "vertical"
                ? "col-resize"
                : "row-resize",
              display: visibleBar ? "block" : "none",
            }}
          >
            {lineBar}
          </div>
        );

        return (
          <Fragment key={index}>
            {element}
            {bar}
          </Fragment>
        );
      })}
    </div>
  );
}

export default Split;
