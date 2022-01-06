import React from 'react';

export const LinkCard = ({ link }) => {
  return (
    <>
      <h2>Ссилка</h2>
      <p>
        Ваша ссилка:  
        <a 
          href={link.to} 
          target="_blank"
          rel="noopener noreferrer"
        >
          {link.to}
        </a>
      </p>
      <p>
        Откуда:  
        <a 
          href={link.from} 
          target="_blank"
          rel="noopener noreferrer"
        >
          {link.from}
        </a>
      </p>
      <p>
        Количество кликов по ссилке: <strong>{link.clicks}</strong>
      </p>
      <p>
        Дата создания: <strong>{new Date(link.date).toLocaleDateString()}</strong>
      </p>
    </>
  );
} 

export default LinkCard;