import Head from "next/head"
import "../app/globals.css";
import NavBar from "@/components/NavBar";

export default function Home(){
    return (
    <div>
        <div>
            <Head>
                <title>Welcome to the Dank Bank</title>
            </Head>
        </div>
        <div>
            <NavBar/>
        </div>
    </div>
    )
}