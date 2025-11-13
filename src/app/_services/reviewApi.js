import supabase from "./supabase"

export async function getReviews(){
    const { data: reviews, error } = await supabase
    .from('reviews')
    .select('*')
    if(error){
        console.log(error)
        throw new Error("error")
    }
    return reviews
}

export async function createReview(data){
    const { data: reviews, error } = await supabase
    .from('reviews')
    .insert([data])
    .select()
    if(error){
        console.log(error)
        throw new Error("error")
    }
    return reviews
}