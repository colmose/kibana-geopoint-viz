'use strict'
import ngMock from 'angular-mocks'
const expect = require('expect.js')

require('../siren-solution-controller')

describe('Siren Solution Controller', () => {
  let $scope

  beforeEach(() => {
    ngMock.module('kibana', function ($provide) {
      $provide.constant('elasticsearchPlugins', [])
    })

    ngMock.inject(function ($rootScope, $controller) {
      $scope = $rootScope
      $controller('SirenController', {
        $scope: $scope
      })
    })
  })

  describe('initialization', () => {
    it('should have the initial vis.params.set', () => {
      expect($scope.vis.params).to.eql({})
    })
  })
})
