const BASE_URL = "http://localhost:3000/characters";

const characterBar = document.getElementById("character-bar");
const nameDisplay = document.getElementById("name");
const imageDisplay = document.getElementById("image");
const voteCount = document.getElementById("vote-count");
const voteForm = document.getElementById("votes-form");
const resetButton = document.getElementById("reset-btn");
const newCharacterForm = document.getElementById("character-form");

let currentCharacter = null;

fetch(BASE_URL)
  .then(res => res.json())
  .then(characters => {
    characters.forEach(renderCharacterSpan);
  });

function renderCharacterSpan(character) {
  const span = document.createElement("span");
  span.textContent = character.name;
  span.style.cursor = "pointer";
  span.addEventListener("click", () => showCharacter(character));
  characterBar.appendChild(span);
}

function showCharacter(character) {
  currentCharacter = character;
  nameDisplay.textContent = character.name;
  imageDisplay.src = character.image;
  imageDisplay.alt = character.name;
  voteCount.textContent = character.votes;
}

voteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const addedVotes = parseInt(e.target.votes.value);
  if (!isNaN(addedVotes) && currentCharacter) {
    const newVoteTotal = currentCharacter.votes + addedVotes;
    updateVotes(currentCharacter.id, newVoteTotal);
  }
  e.target.reset();
});

function updateVotes(id, votes) {
  fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ votes })
  })
    .then(res => res.json())
    .then(updatedCharacter => {
      currentCharacter.votes = updatedCharacter.votes;
      voteCount.textContent = updatedCharacter.votes;
    });
}

resetButton.addEventListener("click", () => {
  if (currentCharacter) {
    updateVotes(currentCharacter.id, 0);
  }
});

if (newCharacterForm) {
  newCharacterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const image = e.target["image-url"].value;

    if (name && image) {
      const newCharacter = {
        name,
        image,
        votes: 0
      };

      fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newCharacter)
      })
        .then(res => res.json())
        .then(savedCharacter => {
          renderCharacterSpan(savedCharacter);
          showCharacter(savedCharacter);
        });

      e.target.reset();
    }
  });
}
