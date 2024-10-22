export default function FilePage({params}){
    const filename = params.filename;
    return(
        <div>{filename}</div>
    )
}