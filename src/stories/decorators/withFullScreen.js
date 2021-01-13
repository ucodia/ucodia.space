import React from "react";
import FullScreen from "../../components/FullScreen";

const withFullScreen = (story) => <FullScreen>{story()}</FullScreen>;

export default withFullScreen;
