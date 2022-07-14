import React, { useState } from 'react'
import { Title, KeyFigures as SSBKeyFigures, References, Divider } from '@statisticsnorway/ssb-component-library'
import PropTypes from 'prop-types'
import { Alert, Button, Row, Col } from 'react-bootstrap'

function KeyFigures(props) {
  const [fetchUnPublished, setFetchUnpublished] = useState(props.paramShowDraft)
  const [keyFigures, setKeyFigures] = useState(props.paramShowDraft && props.draftExist ? props.keyFiguresDraft : props.keyFigures)

  const showPreviewToggle = props.showPreviewDraft && (props.pageTypeKeyFigure || props.paramShowDraft && !props.pageTypeKeyFigure)

  function toggleDraft() {
    setFetchUnpublished((prev) => !prev)
    setKeyFigures(!fetchUnPublished && props.draftExist ? props.keyFiguresDraft : props.keyFigures)
  }

  function addPreviewButton() {
    if (showPreviewToggle && props.pageTypeKeyFigure) {
      return (
        <Col>
          <Button
            variant="primary"
            onClick={toggleDraft}
            className="mb-4"
          >
            {!fetchUnPublished ? 'Vis upubliserte tall' : 'Vis publiserte tall'}
          </Button>
        </Col>
      )
    }
    return
  }

  function addPreviewInfo() {
    if (props.showPreviewDraft) {
      if (fetchUnPublished) {
        return keyFigures.map((keyFigure) => {
          if (props.draftExist && keyFigure.number) {
            return (
              <Col className={`col-12${props.isInStatisticsPage ? ' p-0' : ''}`}>
                <Alert variant='info' className="mb-4">
                  Tallet i nøkkeltallet nedenfor er upublisert
                </Alert>
              </Col>
            )
          } else {
            return (
              <Col className={`col-12${props.isInStatisticsPage ? ' p-0' : ''}`}>
                <Alert variant='warning' className="mb-4">
                  Finnes ikke upubliserte tall for dette nøkkeltallet
                </Alert>
              </Col>
            )
          }
        })
      }
    }
    return
  }

  function createRows() {
    const columns = props.columns

    let isRight = true
    return keyFigures.map((keyFigure, i) => {
      isRight = (!columns || (columns && !isRight) || keyFigure.size === 'large')
      return (
        <React.Fragment key={`figure-${i}`}>
          <Col className={`col-12${columns && keyFigure.size !== 'large' ? ' col-md-6' : ''}${props.isInStatisticsPage ? ' p-0' : ''}`}>
            <SSBKeyFigures {...keyFigure} icon={keyFigure.iconUrl && <img src={keyFigure.iconUrl}
              alt={keyFigure.iconAltText ? keyFigure.iconAltText : ' '}></img>}/>
            {addKeyFigureSource(keyFigure)}
          </Col>
          {i < keyFigures.length - 1 ? <Divider className={`my-5 d-block ${!isRight ? 'd-md-none' : ''}`} light /> : null}
        </React.Fragment>
      )
    })
  }

  function addKeyFigureSource(keyFigure) {
    if ((!props.source || !props.source.url) && keyFigure.source && keyFigure.source.url) {
      const sourceLabel = props.sourceLabel

      return (
        <References className={`${keyFigure.size !== 'large' ? 'mt-3' : ''}`} title={sourceLabel} referenceList={[{
          href: keyFigure.source.url,
          label: keyFigure.source.title
        }]}/>
      )
    }
    return
  }

  function addSource() {
    if (props.source && props.source.url) {
      const sourceLabel = props.sourceLabel

      return (
        <Col className="col-12">
          <References className="col-12 mt-3" title={sourceLabel} referenceList={[{
            href: props.source.url,
            label: props.source.title
          }]}/>
        </Col>
      )
    }
    return
  }

  function addHeader() {
    if (props.displayName) {
      return (
        <Col>
          <Title size={3} className="mb-5">{props.displayName}</Title>
        </Col>
      )
    }
    return
  }

  return (
    <React.Fragment>
      <Row className="d-none searchabletext">
        <Col className="col-12">{props.hiddenTitle}</Col>
      </Row>
      <Row>
        {addPreviewButton()}
        {addPreviewInfo()}
        {addHeader()}
      </Row>
      <Row className={`${props.isInStatisticsPage && 'mt-1 mb-5 mt-lg-0'}`}>
        {createRows()}
        {addSource()}
      </Row>
    </React.Fragment>
  )
}

KeyFigures.propTypes = {
  displayName: PropTypes.string,
  keyFiguresDraft: PropTypes.arrayOf(
    PropTypes.shape({
      iconUrl: PropTypes.string,
      iconAltText: PropTypes.string,
      number: PropTypes.string,
      numberDescription: PropTypes.string,
      noNumberText: PropTypes.string,
      size: PropTypes.string,
      title: PropTypes.string,
      time: PropTypes.string,
      changes: PropTypes.shape({
        changeDirection: PropTypes.string,
        changeText: PropTypes.string,
        changePeriod: PropTypes.string
      }),
      glossary: PropTypes.string,
      greenBox: PropTypes.bool,
      source: PropTypes.shape({
        url: PropTypes.string,
        title: PropTypes.title
      })
    })
  ),
  keyFigures: PropTypes.arrayOf(
    PropTypes.shape({
      iconUrl: PropTypes.string,
      iconAltText: PropTypes.string,
      number: PropTypes.string,
      numberDescription: PropTypes.string,
      noNumberText: PropTypes.string,
      size: PropTypes.string,
      title: PropTypes.string,
      time: PropTypes.string,
      changes: PropTypes.shape({
        changeDirection: PropTypes.string,
        changeText: PropTypes.string,
        changePeriod: PropTypes.string
      }),
      glossary: PropTypes.string,
      greenBox: PropTypes.bool,
      source: PropTypes.shape({
        url: PropTypes.string,
        title: PropTypes.title
      })
    })
  ),
  sourceLabel: PropTypes.string,
  source: PropTypes.shape({
    url: PropTypes.string,
    title: PropTypes.title
  }),
  columns: PropTypes.bool,
  showPreviewDraft: PropTypes.bool,
  paramShowDraft: PropTypes.bool,
  draftExist: PropTypes.bool,
  pageTypeKeyFigure: PropTypes.bool,
  hiddenTitle: PropTypes.string,
  isInStatisticsPage: PropTypes.string
}

export default (props) => <KeyFigures {...props}/>
