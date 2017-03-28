import { expect } from 'chai'
import { indicesHandler } from './../routes'

describe('Siren Solution API', () => {
  describe('indicesHandler', ()=>{
    it('should remove .kibana from indices', (done) => {
      const responseFromES = {
        metadata: {
          indices: {
            '.kibana': 1,
            'notKibana': 2,
            'notKibanaEither': 3
          }
        }
      }

      const expectedResponse = [
        'notKibana',
        'notKibanaEither'
      ]

      expect(indicesHandler(responseFromES)).to.eql(expectedResponse)
      done()
    })
  })
})
