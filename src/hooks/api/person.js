import axios from "../../includes/axios";

const fetchPeople = async (businessId) => {
  try {
    const res = await axios.get(`/business/${businessId}/persons`);
    if (res.status === 200) return res.data;
    else throw Error(`Error ${res.status}`);
  } catch (error) {
    console.log("Failed to fetch people: ", error);
  }
};

const postPerson = async (businessId, data) => {
  try {
    const res = await axios.post(`/business/${businessId}/persons`, {
      ...data,
    });
    if (res.status === 200) return res.data;
    else throw Error(`Error ${res.status}`);
  } catch (error) {
    console.log("Failed to post person: ", error);
  }
};

const getPerson = async (businessId, personId) => {
  try {
    const res = await axios.get(`/business/${businessId}/persons/${personId}`);
    if (res.status === 200) return res.data;
    else throw Error(`Error ${res.status}`);
  } catch (error) {
    console.log("Failed to fetch person: ", error);
  }
};

/**
 *  ISSUE: API is NOT updating all fields (only updating NAME)
 */
const updatePerson = async (businessId, personId, data) => {
  try {
    const res = await axios.put(`/business/${businessId}/persons/${personId}`, {
      ...data,
    });
    if (res.status === 200) return res.data;
    else throw Error(`Error ${res.status}`);
  } catch (error) {
    console.log("Failed to update person: ", error);
  }
};

const deletePerson = async (businessId, personId) => {
  try {
    const res = await axios.delete(
      `/business/${businessId}/persons/${personId}`
    );
    if (res.status === 200) return res.data;
    else throw Error(`Error ${res.status}`);
  } catch (error) {
    console.log("Failed to delete person: ", error);
  }
};

export { fetchPeople, postPerson, getPerson, updatePerson, deletePerson };
