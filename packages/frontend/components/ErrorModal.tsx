import React, { FunctionComponent } from 'react'

const ErrorModal: FunctionComponent = ({ children }) => {
  return (
    <div className="bg-red-400 border-red-500 border-2 rounded p-2 mx-1 my-2 text-red-700 font-semibold">
      {children}
    </div>
  )
}

export default ErrorModal;
