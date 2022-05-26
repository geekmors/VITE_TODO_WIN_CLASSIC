

export function store_get(key){
    
    let data = localStorage.getItem(key)

    if(data){
        return JSON.parse(data)
    }

    return []
}

export function store_set(key, data = []){

    if(!Array.isArray(data)) 
        throw new Error(`store_set: data parameter expects an array, instead got: ${data}`)

    localStorage.setItem(key, JSON.stringify(data))
}

export function store_clear(key){
    localStorage.removeItem(key)
}