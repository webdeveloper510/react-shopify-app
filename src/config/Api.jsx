import axios from "axios"

export const API = {
    BASE_URL: process.env.REACT_APP_BASE_URL,
    SHOPIFY_URL: process.env.REACT_APP_SHOPIFY_URL,
}

export const getToken = async (data) => {
    const response = await axios.post(API.BASE_URL + 'get/token/', data)
        .then(res => {
            return res.data
        })
        .catch((error) => {
            return error
        })
    return response
}

export const verifySubscription = async () => {
    const response = await axios.get(API.BASE_URL + 'checksubscritpion/', {
        headers: {
            Authorization: `Token ${localStorage.getItem('Token')}`
        }
    }).then(res => {
        return res.data
    }).catch((error) => {
        return error
    })
    return response
}

export const getInfluencerList = async () => {
    const response = await axios.get(API.BASE_URL + 'influencer/list/', {
        headers: {
            Authorization: `Token ${localStorage.getItem('Token')}`
        }
    }).then(res => {
        return res.data
    }).catch(err => {
        return err;
    })
    return response
}

export const getInfluencer = async (id) => {
    const response = await axios.get(API.BASE_URL + `influencerdata/${id}`, {
        headers: {
            Authorization: `Token ${localStorage.getItem('Token')}`
        }
    }).then(res => {
        return res.data
    }).catch(err => {
        return err;
    })
    return response
}

export const getProductList = async () => {
    const response = await axios.get(API.BASE_URL + 'product/list/', {
        headers: {
            Authorization: `Token ${localStorage.getItem('Token')}`
        }
    }).then(res => {
        return res.data
    }).catch(err => {
        return err;
    })
    return response
}

export const getDataByProduct = async (data) => {
    const response = await axios.post(API.BASE_URL + "product/url/", data, {
        headers: {
            Authorization: `Token ${localStorage.getItem('Token')}`
        }
    }).then(res => {
        return res.data
    }).catch(err => {
        return err;
    })
    return response
}

export const payInfluencer = async (data) => {

    const response = await axios.post(API.BASE_URL + "create_customer/", data, {
        headers: {
            Authorization: `Token ${localStorage.getItem('Token')}`
        }
    }).then(res => {
        return res.data;
    }).catch(error => {
        return error;
    })
    return response
}

export const influencerCampList = async () => {
    const response = await axios.get(API.BASE_URL + "allcampaign/", {
        headers: {
            Authorization: `Token ${localStorage.getItem('Token')}`
        }
    }).then(res => {
        return res.data;
    }).catch(err => {
        return err;
    })
    return response;
}
