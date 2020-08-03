import React from "react";
import LoaderGif from "../../assets/fox_loading.gif";
import "../../styles/usernotapproved.css";

function LoaderPage() {
  // const message = 'Hello Function Component!';

  return (
    <div style={{background:"#F0E0D3",width:"100%",height:"100%",alignItems:"center",display:"flex",
    flexDirection: "column",justifyContent:"center"}}>
      <img src={LoaderGif} width="600" height="auto"/>
    </div>
  );
}

export default LoaderPage;
