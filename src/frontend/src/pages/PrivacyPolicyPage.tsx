import React from 'react'
import FormContainer from '../components/forms/FormContainer'
import ReactMarkdown from 'react-markdown'
import { privacyPolicyMarkdown } from '../utils/privacyPolicyMarkdown'

const PrivacyPolicyPage = () => {
  return (
      <FormContainer>
        <ReactMarkdown >
          {privacyPolicyMarkdown}
        </ReactMarkdown>
      </FormContainer>
    )
}

export default PrivacyPolicyPage