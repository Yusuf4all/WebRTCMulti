import React, { useEffect, useRef, useState } from "react";
import { v1 as uuid } from "uuid";

const CreateRoom = (props) => {
  function create() {
    const id = uuid();
    props.history.push(`/room/${id}`);
  }

  return (
    <>
      <div id="meetingbox">
        <p>
          It seems you are not trying to join any meeting! You may start a new
          meeting. Here is generated for you.{" "}
          <button onClick={create}>Create room</button>
        </p>
      </div>
    </>
  );
};

export default CreateRoom;
