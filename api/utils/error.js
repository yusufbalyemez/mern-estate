//Her hatayı şekillendiren fonksiyon. Değerleri kendin veriyorsun o da ona göre hatayı basıyor.
export const errorHandler = (statusCode,message)=>{
    const error = new Error();
    error.statusCode = statusCode;
    error.message = message;
    return error;
}