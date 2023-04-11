let url = "https://openapi.programming-hero.com/api/ai/tools";
let singleCardUrl = "https://openapi.programming-hero.com/api/ai/tool/";

const cardContainer = document.getElementById("card_container");
const seeMore = document.getElementById("see-more");
const modalBox = document.querySelector(".modal-content");
const spinWrapper = document.querySelector(".spinner-wrapper");
const sortDate = document.getElementById("sort-date");

// data Variable
let dataValue = []

// console.log(modalBox)

// spinner tiggere
const spinTiggere = () => {
  spinWrapper.classList.toggle("d-none")
}
const showData = (dataValue) => {
  // clear the inner section of card container
  cardContainer.innerHTML = "";

  dataValue.map((singleData) => {
    let divCon = divElement(singleData);

    // console.log(divCon)
    cardContainer.appendChild(divCon);
  });
};

// pricing Content with null handle
const pricingContent = (pricingArray) => {
  let content = ''

  if(pricingArray) {
  for(item of pricingArray) {
    content += `<div class="box-price d-flex justify-content-center align-items-center"><p>${item.price}/<br />${item.plan}</p></div>`
  }
} else {
  content = `<div class="box-price d-flex justify-content-center align-items-center"><p>Free of Cost/<br />Basic</p></div>
  <div class="box-price d-flex justify-content-center align-items-center"><p>Free of Cost/<br />Pro</p></div>
  <div class="box-price d-flex justify-content-center align-items-center"><p>Free of Cost/<br />Enterprise</p></div>`;
}

  return content;
}

// modal feature data
const modalFeature = (data) => {
  let listItem = ''

  if(data) {
   for(item in data) {
    listItem += `<li>${data[item].feature_name}</li>`
    // console.log(data[item].feature_name)
    // cnt++
    }} else {
      listItem = `<li>No Data Found</li>`
    }
  // console.log(data.)
  return listItem
}

// modal integration data 
const modalIntegration = (data) => {
  let listItem = ''

  if(data) {
  for(item of data) {
   listItem += `<li>${item}</li>`
   // console.log(data[item].feature_name)
   // cnt++
  } } else {
    listItem = `<li>No Data Found</li>`
  }
 // console.log(data.)
 return listItem
}

// data processing and showing in the font page
const processModalData = (id) => {
  spinTiggere();
  fetch(singleCardUrl + id)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.data);
      spinTiggere();
      let accuracy = data.data.accuracy.score;
      let inputOutput = {
        input: 'Can you give any example?',
        output: 'No! Not Yet! Take a break!!!'
      }
      if(data.data.input_output_examples) {
      inputOutput =
        data.data.input_output_examples[
          Math.floor(Math.random() * data.data.input_output_examples.length)
        ];}

      // console.log(inputOutput)
      modalBox.innerHTML = `<div class="modal-header">
        <button type="button" class="cls-btn position-absolute" data-bs-dismiss="modal" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="modal-body">
      <div class="d-flex flex-lg-row flex-column">
        <div class="box-1 d-flex flex-column align-items-center">
        <h6>${data.data.description}</h6>
        <div class="d-flex gap-3 flex-md-row flex-column pricing_box my-3">
          ${pricingContent(data.data.pricing)}
        </div>
        <div class="details-box justify-content-around d-flex gap-3">
        <div class="d-box-1">
        <h6>Features</h6>
        <ul class="modal-features">${modalFeature(data.data.features)}</ul>
        </div>
        <div class="d-box-2">
        <h6>Integration</h6>
        <ul class="modal-integration">${modalIntegration(data.data.integrations)}</ul>
        </div>
        </div>
        </div>
        <div class="box-2">
        <div class="position-relative mb-2">
        <img src="${data.data.image_link[0]}" class="modal-image mb-3" alt="..." />
        ${accuracy ? `<div class="accuracy position-absolute top-0 end-0 mt-1">${accuracy}% accuray</div>` : ''}
        </div>
        <h6>${inputOutput.input}</h6>
        <p class="fs-6 modal-features">${inputOutput.output}</p>
        </div>
      </div>
      </div>`;
    });
};

// making list for the feature section
const listMake = (list) => {
  let itemList = "";
  for (item of list) {
    itemList += `<li>${item}</li>`;
  }
  return itemList;
};

// card maker function
const divElement = (prop) => {
  const div = document.createElement("div");
  div.classList.add("col-sm-12", "col-md-4", "mb-3");
  div.innerHTML = `<div class="card">
    <div class="img-thumbnail img-box">
    <img src="${prop.image}" class="card-img-top img-fluid" alt="..." />
    </div>
    <div class="card-body">
      <h5 class="card-title">Features</h5>
      <p class="card-text">
        <ol>${listMake(prop.features)}</ol>
      </p>
      <hr />
      <div class="title-info">
        <h4>${prop.name}</h4>
        <div class="d-flex justify-content-between">
          <div class="date">
            <i class="fa-solid fa-calendar-days"></i> ${prop.published_in}
          </div>
          <button type="button" class="icon" id="${
            prop.id
          }" onClick="processModalData(this.id)" data-bs-toggle="modal" data-bs-target="#exampleModal">
  <i class="fa-solid fa-arrow-right"></i>
</button>
        </div>
      </div>
    </div>
  </div>`;

  return div;
};

// calling API function
const callApi = async () => {
  spinTiggere()
  let res = await fetch(url);
  let data = await res.json();
  // console.log(data.data.tools[0])
  spinTiggere();
  return data.data.tools;
};

callApi().then((value) => {
  dataValue = value.slice(0, 6);

  // show some data when page load
  showData(dataValue);

  // show full data when see more button tiggered
  seeMore.addEventListener("click", () => {
    spinTiggere();
    dataValue = value;

    showData(dataValue);
    seeMore.classList.add("d-none");
    spinTiggere();
  });
});

// sort by date
sortDate.addEventListener('click', () => {
  spinTiggere()
  dataValue.sort(function (a, b) {
    let c = new Date(a.published_in);
    let d = new Date(b.published_in);
    // console.log(a, b)
    return c - d;
  });
  spinTiggere()
  showData(dataValue)
  // console.log(dataValue)
})
