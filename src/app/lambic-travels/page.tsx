import styles from "@/app/lambic-travels/TravelsPage.module.css";
import GenericBanner from "@/app/components/GenericBanner/GenericBanner";
import Footer from "@/app/components/GenericFooter/GenericFooter";

export default function LambicTravelsPage() {
    return (
        <>
            <GenericBanner backLink={`/`} />
            <main className={styles.pageContainer}>
                <div className={styles.textWrapper}>
                    <p>
                        {`With this page you'll be able to locate a wide range of lambic places, including brewers, blenders, and closed producers (we exclusded experimental producers as they are private locations and not open for visits), as well as bars, cafés, and restaurants serving lambic. This tool is intended to help you plan your visits efficiently and give you an overview of the lambic landscape around Pajottenland. 
                 
                        To display (or hide) a specific category of places, click on the menu icon on the top loft of the map. You can also click on the individual icons to get more information about each place, including links to their respective pages on this website when available.
         
                        To calculate an itinerary, simply click on a location, and a window will open with a "Get Directions" icon. Clicking on it will open Google Maps with the route from your current location to the selected place, or the starting point of your choice.`}
                    </p>
                </div>
                <div className={styles.mapWrapper}>
                    <iframe 
                        src="https://www.google.com/maps/d/u/0/embed?mid=1zsn8ymC4XOFqJdA7D5mZt4u_K56j9fg&ehbc=2E312F&noprof=1"
                        className={styles.mapIframe}
                        allowFullScreen
                        loading="lazy"
                        title="Lambic Map"
                    ></iframe>
                </div>
            </main>
            <Footer />
        </>
    );
}

