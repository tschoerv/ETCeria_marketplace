'use client'
import { forwardRef, useImperativeHandle, useState, useEffect, useRef } from "react";

const RangeSlider = forwardRef(({ initialMin, initialMax, min, max, step, priceCap, isDisabled, onSliderChange, renderSliderTrigger}, ref) => {
  const progressRef = useRef(null);
  const minValueRef = useRef(initialMin);
  const maxValueRef = useRef(initialMax);
  const [minValue, setMinValue] = useState(initialMin);
  const [minInputValue, setMinInputValue] = useState(initialMin);
  const [maxValue, setMaxValue] = useState(initialMax);

  useImperativeHandle(ref, () => ({
    getMin: () => minValueRef.current,
    getMax: () => maxValueRef.current,
  }));

  const handleMin = (e) => {
    if (maxValue - minValue >= priceCap && maxValue <= max) {
      onSliderChange();
      if (parseInt(e.target.value) > parseInt(maxValue)) {
      } else {
        setMinValue(parseInt(e.target.value));
      }
    } else {
      if (parseInt(e.target.value) < minValue) {
        setMinValue(parseInt(e.target.value));
      }
    }
  };

  const handleMax = (e) => {
    if (maxValue - minValue >= priceCap && maxValue <= max) {
      onSliderChange();
      if (parseInt(e.target.value) < parseInt(minValue)) {
      } else {
        setMaxValue(parseInt(e.target.value));
      }
    } else {
      if (parseInt(e.target.value) > maxValue) {
        setMaxValue(parseInt(e.target.value));
      }
    }
  };

  useEffect(() => {
    setMinInputValue(minValue);
    const totalRange = max - min;

    const leftPercentage = ((minValue - min) / totalRange) * 100; // Adjusted from minValue
    const rightPercentage = 100 - ((maxValue - min) / totalRange) * 100; // Adjusted from maxValue

    progressRef.current.style.left = leftPercentage + "%";
    progressRef.current.style.right = rightPercentage + "%";

    minValueRef.current = minValue; // Update ref to current minValue
    maxValueRef.current = maxValue; // Update ref to current maxValue

  }, [minValue, maxValue, max, min]);

  useEffect(() => {
    setMinValue(initialMin);
    setMinInputValue(initialMin);
    setMaxValue(initialMax);
    minValueRef.current = initialMin;
      maxValueRef.current = initialMax;
  }, [initialMin, initialMax, renderSliderTrigger]);




  return (
    <div className="flex place-items-center">
      <div className="w-52 ">
        <div className="mb-3 mt-2">
          <div className="slider relative h-1 rounded-md bg-gray-300">
            <div
              className="progress absolute h-1 bg-green-400 rounded "
              ref={progressRef}
            ></div>
          </div>

          <div className="range-input relative  ">
            <input
              onChange={handleMin}
              type="range"
              min={min}
              step={step}
              max={max}
              value={minValue}
              className="range-min absolute w-full  -top-1  h-1   bg-transparent  appearance-none pointer-events-none"
              disabled={isDisabled}
            />

            <input
              onChange={handleMax}
              type="range"
              min={min}
              step={step}
              max={max}
              value={maxValue}
              className="range-max absolute w-full  -top-1 h-1  bg-transparent appearance-none  pointer-events-none"
              disabled={isDisabled}
            />
          </div>
        </div>
        <div className="flex justify-between items-center mb-5 ">
          <div className="rounded-md">
            <input
              onChange={(e) => { if (e.target.value >= min) { setMinValue(e.target.value); } setMinInputValue(e.target.value); onSliderChange() }}
              type="number"
              value={minInputValue}
              className="w-12 rounded-md bg-default-100
              border-medium
              border-default-200
              text-sm"
              disabled={isDisabled}
            />
          </div>
          <p>-</p>
          <div className=" ">
            <input
              onChange={(e) => { if (e.target.value <= max) { setMaxValue(e.target.value); } onSliderChange() }}
              type="number"
              value={maxValue}
              className="w-12 rounded-md bg-default-100
              border-medium
              border-default-200
              text-sm"
              disabled={isDisabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

RangeSlider.displayName = 'RangeSlider';

export default RangeSlider;