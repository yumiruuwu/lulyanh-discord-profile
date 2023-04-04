const userID = "497010169704742912"; //put ur discord user id here.
import token from "./token.json" assert { type: "json" };
const statusImage = document.getElementById("status-image");
const discordUsername = document.getElementById("discord-username");
const discordDiscrim = document.getElementById("discord-discriminator");
const discordUserState = document.getElementById("user-status");
const discordUserAvatar = document.getElementById("user-avatar");
const discordUserBanner = document.getElementById("user-banner");

async function fetchDiscordStatus() {
  try {
    const response = await axios.get(
      `https://api.lanyard.rest/v1/users/${userID}`
    );
    const { data } = response.data;
    const { discord_user, discord_status, activities } = data;

    // Get the corresponding image path for the status.
    let imagePath;
    switch (discord_status) {
      case "online":
        imagePath = "/public/status/online.svg";
        break;
      case "idle":
        imagePath = "/public/status/idle.svg";
        break;
      case "dnd":
        imagePath = "/public/status/dnd.svg";
        break;
      case "offline":
        imagePath = "/public/status/offline.svg";
        break;
      default:
        imagePath = "";
        break;
    }

    // Check the active status to update the image path.
    if (
      activities.find(
        (activity) => activity.type === 1 && activity.url.includes("twitch.tv")
      )
    ) {
      imagePath = "/public/status/streaming.svg";
    }

    //Get user's username & discriminator
    discordUsername.innerHTML = discord_user.username;
    discordDiscrim.innerHTML = `#${discord_user.discriminator}`;

    //Get user's status
    if (activities.find(
      (activity) => activity.type === 4
    )) {
      discordUserState.innerHTML = activities[0].state;
      discordUserState.style.display = "block";
    }

    //Get user's avatar & banner(if they have one)
    let discordApi = fetch(`https://discord.com/api/v10/users/${userID}`, {
      method: 'GET',
      headers: {
        Authorization: `Bot ${token}`
      }
    });

    console.log(discordApi);

    discordUserAvatar.src = `https://cdn.discordapp.com/avatars/${userID}/${discord_user.avatar}.png?size=1024`;
    discordUserBanner.src = `https://cdn.discordapp.com/avatars/${userID}/${discordApi.banner}.png?size=1024`


    // Update the image.
    statusImage.src = imagePath;
    statusImage.alt = `Discord status: ${discord_status}`;
  } catch (error) {
    console.error("Unable to retrieve Discord status:", error);
  }
}

fetchDiscordStatus();
setInterval(fetchDiscordStatus, 5000); // Update status every 5 seconds
