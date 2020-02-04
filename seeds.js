var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var seeds = [
	{
		name: "Stock Photocamp",
		image: "https://image.shutterstock.com/image-photo/fire-on-ice-night-campground-600w-1222266388.jpg",
		description: "Beautifull. Lotta hills. Lorem ipsum dolor amet selfies leggings cold-pressed fingerstache, sriracha affogato trust fund salvia blog chicharrones tousled kogi poke taxidermy. Vinyl man bun listicle mlkshk mumblecore meditation flannel semiotics drinking vinegar chicharrones occupy affogato asymmetrical meh DIY. Selvage biodiesel kale chips hammock. Lo-fi selfies cold-pressed kale chips synth chia franzen. Waistcoat brunch plaid pinterest, tofu 3 wolf moon occupy man bun wayfarers pitchfork viral poutine chartreuse hexagon polaroid. Live-edge keffiyeh chambray shoreditch gastropub ethical tbh man braid vaporware you probably haven't heard of them tousled sartorial biodiesel chicharrones."
	},
	{
		name: "Marverlous Nether",
		image: "https://indiaenews.in//wp-content/uploads/2019/05/MANA-1024x576.jpg",
		description: "The Best place on Earth. Beware of sleeping here though! Lorem ipsum dolor amet selfies leggings cold-pressed fingerstache, sriracha affogato trust fund salvia blog chicharrones tousled kogi poke taxidermy. Vinyl man bun listicle mlkshk mumblecore meditation flannel semiotics drinking vinegar chicharrones occupy affogato asymmetrical meh DIY. Selvage biodiesel kale chips hammock. Lo-fi selfies cold-pressed kale chips synth chia franzen. Waistcoat brunch plaid pinterest, tofu 3 wolf moon occupy man bun wayfarers pitchfork viral poutine chartreuse hexagon polaroid. Live-edge keffiyeh chambray shoreditch gastropub ethical tbh man braid vaporware you probably haven't heard of them tousled sartorial biodiesel chicharrones."
	},
	{
		name: "Fictious Termen",
		image: "https://tourtrips.ru/wp-content/uploads/gde-otdokhnut-s-palatkoy-v-podmoskovie.jpg",
		description: "Named in honor of tha greatest musical instrument existing. Lorem ipsum dolor amet selfies leggings cold-pressed fingerstache, sriracha affogato trust fund salvia blog chicharrones tousled kogi poke taxidermy. Vinyl man bun listicle mlkshk mumblecore meditation flannel semiotics drinking vinegar chicharrones occupy affogato asymmetrical meh DIY. Selvage biodiesel kale chips hammock. Lo-fi selfies cold-pressed kale chips synth chia franzen. Waistcoat brunch plaid pinterest, tofu 3 wolf moon occupy man bun wayfarers pitchfork viral poutine chartreuse hexagon polaroid. Live-edge keffiyeh chambray shoreditch gastropub ethical tbh man braid vaporware you probably haven't heard of them tousled sartorial biodiesel chicharrones."
	}
];

async function seedDB(){
	try {
		await Comment.deleteMany({});
		console.log('campgrounds removed');
		await Campground.deleteMany({});
		console.log('campgrounds created');
		
		for (const seed of seeds) {
			let campground = await Campground.create(seed);
			console.log('Campground created');
			let comment = await Comment.create(
				{
					text: "The best place ever to be with friends",
					author: "Stew"
				}
			)
			console.log('Comment created');
			campground.comments.push(comment);
			campground.save();
			console.log('Comment added to a campground!')
		}
	} catch (err) {
		console.log(err);
	}
}

module.exports = seedDB;