
import React, { Component } from "react"
import { render } from "react-dom"
import DefautlComponent from '@beisen-cmps/<%= moduleName %>'

var props = {
  // ...
}

render(
  <DefautlComponent {...props} />,
  document.getElementById("root")
)
