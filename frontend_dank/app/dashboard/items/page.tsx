import ListItems from '@/app/ui/dashboard/list-items';
import { lusitana } from '@/app/ui/fonts';

export default async function Page() {
  const res = await fetch("http://localhost:8000/api_dank/item");
  const data = res.json()
  console.log(res)

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Items
      </h1>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* <ListItems items={my_items.} /> */}
      </div>
    </main>
  );
}