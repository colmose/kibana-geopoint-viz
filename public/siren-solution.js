'use strict'
import 'ui/autoload/styles'
import editorTemplate from './templates/siren-solution-params.html'
import template from './templates/siren-solution.html'
import './less/main.less'
import './siren-solution-controller'

// register the provider with the visTypes registry
require('ui/registry/vis_types').register(MapVisProvider)

function MapVisProvider (Private) {
  const TemplateVisType = Private(require('ui/template_vis_type/template_vis_type'))
  const Schemas = Private(require('ui/vis/schemas'))
  return new TemplateVisType({
    name: 'Siren Solution',
    icon: 'fa-globe',
    title: 'Siren Solution',
    description: 'A plugin to visualise logs geolocations',
    template: template,
    params: {
      defaults: {
        indexPattern: null,
        geofieldName: null,
        center: {
          lat: 53,
          lng: -107,
          zoom: 2
        },
        defaults: {
          tileLayer: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
          maxZoom: 14,
          path: {
            weight: 10,
            color: '#800000',
            opacity: 1
          }
        },
        markers: {},
        displayMap: false
      },
      editor: editorTemplate
    },
    schemas: new Schemas([
      {
        group: 'buckets',
        name: 'geofield',
        title: 'Geofield',
        min: 1,
        max: 1,
        aggFilter: 'geohash_grid'
      }
    ])
  })
}
