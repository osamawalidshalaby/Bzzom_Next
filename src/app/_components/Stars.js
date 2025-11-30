"use client";
import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";

export default function Stars({
  set = null,
  stars = 5,
  defaultValue = 0,
  Width = "30px",
  Color = "#f5b301",
  fsize = "25px",
  counter = true,
  messages = [],
  classname = "",
}) {
  const [rate, setrate] = useState(defaultValue);
  const [hover, sethover] = useState(0);

  function create_stars() {
    let stars_arr = [];
    for (let i = 1; i <= stars; i++) {
      stars_arr.push(
        <STAR
          num={i}
          set={set}
          full={i <= (hover || rate)}
          Width={Width}
          Color={Color}
          setrate={setrate}
          sethover={sethover}
          key={`star-${i}`}
        />
      );
    }
    return stars_arr;
  }

  return (
    <div
      className={classname}
      style={{
        display: "flex",
        flexFlow: "row nowrap",
        gap: "10px",
        width: "fit-content",
        alignItems: "center",
      }}
    >
      <div
        style={{ display: "flex", flexFlow: "row wrap", width: "fit-content" }}
      >
        {create_stars()}
      </div>
      {counter && (
        <p
          style={{ color: Color, fontSize: fsize, margin: "0", width: "20px" }}
        >
          {messages.length !== 0 && messages.length === stars
            ? messages[hover - 1] || messages[rate - 1]
            : hover || rate}{" "}
        </p>
      )}
    </div>
  );
}

function STAR({ num, set, Width, Color, setrate, sethover, full }) {
  const mystar = useRef(null);

  useEffect(() => {
    function handlekeypress(event) {
      if (event.key === "Enter" && document.activeElement === mystar.current) {
        mystar.current.click();
        setrate(num);
        if (set) {
          set(num);
        }
      }
    }
    document.addEventListener("keypress", handlekeypress);
    return () => document.removeEventListener("keypress", handlekeypress);
  }, [setrate, num, set]);

  function onrate() {
    setrate(num);
    if (set) {
      set(num);
    }
  }

  return (
    <span
      role="button"
      ref={mystar}
      tabIndex="0"
      onMouseEnter={() => sethover(num)}
      onMouseLeave={() => sethover(0)}
      onClick={onrate}
      className="cursor-pointer"
    >
      {full ? (
        <Star size={Width} className={`fill-[${Color}] text-[#C49A6C]`} />
      ) : (
        <Star size={Width} className={"text-white/30"} />
      )}
    </span>
  );
}
