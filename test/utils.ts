
import * as chai from 'chai'

import * as assert from 'assert'

export { chai }

const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)

const expect = chai.expect

export {
  assert,
  expect
}
