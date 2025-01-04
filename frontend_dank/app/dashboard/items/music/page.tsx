import ListItems from '@/app/ui/dashboard/list-items';
import { lusitana } from '@/app/ui/fonts';
import ItemDetails from '@/app/ui/items/details';

export default async function Page() {
  const items_res = await fetch("http://localhost:8000/api_dank/music");
  const data = await items_res.json()
  console.log(data.results) //json array where each object is an item returned from the api

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dank Music
      </h1>
      <div className="flex flex-col md:flex-row space-x-4">
        <div className="md:w-1/2 grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
          <ListItems items={data.results} />
        </div>
        <div className="md:w-1/2 grid-cols-1 bg-red-300">
          <ItemDetails item = {data.results[0]}/>
        </div>
      </div>
    </main>
  );
}