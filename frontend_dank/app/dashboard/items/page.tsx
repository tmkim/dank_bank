import ListItems from '@/app/ui/dashboard/list-items';
import { lusitana } from '@/app/ui/fonts';

export default async function Page() {
  const items_res = await fetch("http://localhost:8000/api_dank/items");
  const data = await items_res.json()
  console.log(data.results) //json array where each object is an item returned from the api

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Items
      </h1>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <ListItems items={data.results} />
      </div>
    </main>
  );
}