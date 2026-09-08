import Commitments from "../organims/commitments";
import Gallery from "../organims/gallery";
import Hero from "../organims/hero";
import Numbers from "../organims/numbers";
import Story from "../organims/story";
import Values from "../organims/values";

/**
 * Page « À propos ».
 *
 * L'ordre suit une progression volontaire : ce que nous sommes, d'où nous
 * venons, ce à quoi nous tenons, la preuve chiffrée, puis l'invitation à
 * acheter ou à écrire.
 */
const AboutViews = () => (
	<div className="pb-24">
		<Hero />

		<div className="space-y-24 pt-20 md:space-y-32 md:pt-28">
			<Story />
			<Values />
		</div>

		<div className="mt-24 md:mt-32">
			<Numbers />
		</div>

		<div className="space-y-24 pt-24 md:space-y-32 md:pt-32">
			<Gallery />
			<Commitments />
		</div>
	</div>
);

export default AboutViews;
