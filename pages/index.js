import Header from '../components/Header';
import Feed from '../components/Feed';
import Head from 'next/head'
import Modal from '../components/Modal';


export default function Home() {
  return (

    <div className="bg-gray-50 h-screen overflow-y-scroll">
      <Head>
        <title> DeeJam! </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <Feed />

      <Modal />
    </div>


  )
}