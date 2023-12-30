// pages/index.tsx
import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import { Schema } from '@/amplify/data/resource';
import { actionTypes } from './actionTypes';

// generate your data client using the Schema from your backend
const client = generateClient<Schema>();

export default function HomePage() {
  const [ecoActions, setEcoActions] = useState<Schema['EcoAction'][]>([]);

  useEffect(() => {
    const sub = client.models.EcoAction.observeQuery().subscribe(({ items }) =>
      setEcoActions([...items])
    );

    return () => sub.unsubscribe();
  }, []);

  return (
    <main>
      <h1>Hello, Amplify 👋</h1>
      <div>
        {actionTypes.map((label, i) => (
          <button
            key={i}
            onClick={async () => {
              const { errors, data: newAction } =
                await client.models.EcoAction.create({
                  comment: window.prompt('comment'),
                  actionType: label,
                });

              console.log(errors, newAction);
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <ul>
        {ecoActions.map((action) => (
          <li key={action.id}>
            {action.createdAt.substring(0, 10)} {action.comment} -{' '}
            {action.actionType}
          </li>
        ))}
      </ul>
    </main>
  );
}
