import MeetupList from "../components/meetups/MeetupList";
import { MongoClient } from "mongodb";
import Head from "next/head";

function HomePage(props) {
  return (
    <>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active React Meetups!"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </>
  );
}

// nextjs will first call getStaticProps() before calling the component function
// allows us to fetch the data before the component is rendered, so that the component can be rendered with the returned data
// info: code here gets executed during the build process, not on the server and not on the clients of the visitors
export async function getStaticProps() {
  // fetch data from an API or Database or file from your file system
  const MONGODB_URI = process.env.MONGODB_URI;
  const client = await MongoClient.connect(MONGODB_URI);

  const db = client.db();
  const meetupsCollection = db.collection("meetups");

  // find all documents in this collection
  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        image: meetup.image,
        address: meetup.address,
        description: meetup.description,
        id: meetup._id.toString(),
      })),
    },
    // this page will be regenerated on the server every 1 seconds, if there are requests for this page
    revalidate: 1,
  };
}

/*
// this function runs for every incoming request
// - should be used only if we have data that changes multiple times every second or we need access to the request object (e.g. for authentification)
// - slower than getStaticProps()
export async function getServerSideProps(context) {
  const req = context.req; // request object
  const res = context.res; // response object

  // fetch data from an API or Database or file from your file system
  // any code we write here will run on the server and never on the client
  // we can perform operations that use credentals here, that should not be exposed to the users
  return {
    props: {
      meetups: DUMMY_MEETUPS,
    },
  };
}
*/

export default HomePage;
