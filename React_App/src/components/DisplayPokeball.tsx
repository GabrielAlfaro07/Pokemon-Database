import openPokeball from "../assets/open-pokeball.png";
import closePokeball from "../assets/closed-pokeball.png";
import midClosedPokeball from "../assets/mid-closed-pokeball.png";
import { useEffect, useState } from "react";
function DisplayPokeball() {
    const [isAnimating, setIsAnimating] = useState(false);
    const [animationStage, setAnimationStage] = useState(0);
    const [isOpening, setIsOpening] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
  
    useEffect(() => {
      let timer: ReturnType<typeof setTimeout>;
  
      if (isAnimating) {
        if (isOpening) {
          timer = setTimeout(() => {
            setAnimationStage(0);
            setIsAnimating(false);
            setIsOpening(false);
          }, 250);
        } else if (isClosing) {
          timer = setTimeout(() => {
            setAnimationStage(2);
            setIsAnimating(false);
            setIsClosing(false);
          }, 250);
        } else if (animationStage === 1) {
          timer = setTimeout(() => {
            if (isOpening) {
              setAnimationStage(0);
            } else if (isClosing) {
              setAnimationStage(2);
            }
            setIsAnimating(false);
          }, 250);
        }
      }
  
      return () => clearTimeout(timer);
    }, [isAnimating, isOpening, isClosing, animationStage]);
  
    const handleClick = () => {
      if (!isAnimating) {
        setIsAnimating(true);
  
        if (animationStage === 0) {
          setAnimationStage(1);
          setIsClosing(true);
        } else if (animationStage === 2) {
          setAnimationStage(1);
          setIsOpening(true);
        } else if (animationStage === 1) {
          if (isOpening) {
            setAnimationStage(0);
          } else if (isClosing) {
            setAnimationStage(2);
          }
          setIsAnimating(false);
        }
      }
    };
  
    let pokeballImage;
    switch (animationStage) {
      case 1:
        pokeballImage = midClosedPokeball;
        break;
      case 2:
        pokeballImage = closePokeball;
        break;
      default:
        pokeballImage = openPokeball;
    }
  
    return (
      <img
        src={pokeballImage}
        alt="pokeball"
        className="w-8 h-8 transform -translate-x-1/2 -translate-y-1/8 z-10 cursor-pointer"
        onClick={handleClick}
      />
    );
  }

export default DisplayPokeball;