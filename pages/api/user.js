import { getSession } from '../../lib/neo4j';

export default async function handler(req, res) {
  const session = getSession();
  console.log(session);

  try {
    // Your Neo4j query here
    // const result = await session.run('MATCH (n) RETURN n LIMIT 10');
    // ... process the result ...

    res.status(200).json({ data: 'some data' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await session.close();
  }
}
