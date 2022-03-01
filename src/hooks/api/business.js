import axios from "../../includes/axios";

const fetchBusinesses = async () => {
  try {
    const res = await axios.get("/business");
    if (res.status === 200) return res.data.businesses;
    else throw Error(`Error ${res.status}`);
  } catch (error) {
    console.log("Failed to fetch businesses: ", error);
  }
};

const fetchBusiness = async (businessId) => {
  try {
    const res = await axios.get(`/business/${businessId}`);
    if (res.status === 200) return res.data;
    else throw Error(`Error ${res.status}`);
  } catch (error) {
    console.log("Failed to fetch business: ", error);
  }
};

const postBusiness = async (data) => {
  try {
    const res = await axios.post("/business", { ...data });
    if (res.status === 200) return res.data;
    else throw Error(`Error ${res.status}`);
  } catch (error) {
    console.log("Failed to post businesses: ", error);
  }
};

const updateBusiness = async (businessId, data) => {
  try {
    const res = await axios.put(`/business/${businessId}`, { ...data });
    if (res.status === 200) return res.data;
    else throw Error(`Error ${res.status}`);
  } catch (error) {
    console.log("Failed to update business: ", error);
  }
};

const deleteBusiness = async (businessId) => {
  try {
    const resPeople = await axios.get(`/business/${businessId}/persons`);
    if (resPeople.status === 200) {
      let promises = [];
      const { persons } = resPeople.data;
      persons.forEach((person) => {
        promises.push(
          axios.delete(`/business/${businessId}/persons/${person.personId}`)
        );
      });
      await Promise.all(promises);
    }
    const res = await axios.delete(`/business/${businessId}`);
    if (res.status === 200) return res.data;
    else throw Error(`Error ${res.status}`);
  } catch (error) {
    console.log("Failed to delete business: ", error);
  }
};

export {
  fetchBusinesses,
  fetchBusiness,
  postBusiness,
  updateBusiness,
  deleteBusiness,
};
