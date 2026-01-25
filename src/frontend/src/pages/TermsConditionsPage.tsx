import ReactMarkdown from 'react-markdown'
import FormContainer from '../components/forms/FormContainer'
import { termsMarkdown } from '../utils/termsMarkdown'

const TermsConditionsPage = () => {
  return (
    <FormContainer>
      <ReactMarkdown >
        {termsMarkdown}
      </ReactMarkdown>
    </FormContainer>
  )
}

export default TermsConditionsPage
