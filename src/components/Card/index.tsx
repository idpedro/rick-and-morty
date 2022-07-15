import Image from "next/image";
import React from "react";
import { Character } from "../../domain/Character.model";
import styles from "./styles.module.scss";
interface CardProps {
  character: Character;
}
const Card = ({
  character: { name, image, species, status, location },
}: CardProps) => {
  return (
    <div className={styles.card}>
      <figure>
        <Image src={image} width={200} height={200} alt={name} />
      </figure>
      <div>
        <h1>{name}</h1>
        <h2>{species}</h2>
        <h3>{location.name}</h3>
        <p className={`${styles.life__status} ${status.toLowerCase()}`}>
          {status}
        </p>
      </div>
    </div>
  );
};

export { Card };
