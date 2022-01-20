import React from 'react'
import { Divider } from '@statisticsnorway/ssb-component-library'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

function HighchartReactExample(props) {
  const options = {
    title: {
      text: 'My chart'
    },
    series: [{
      data: [1, 2, 3]
    }]
  }

  console.log('highcharts react example test')
  return (
    <div>
      <h1>Highcharts React Eksempel</h1>
      <Divider />
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    </div>
  )
}

export default (props) => <HighchartReactExample {...props}/>
