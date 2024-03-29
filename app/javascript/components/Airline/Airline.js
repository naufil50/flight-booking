import React, { useState, useEffect, Fragment } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import Review from './Review'
import ReviewForm from './ReviewForm'
import Header from './Header'

const Wrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
`

const Column = styled.div`
  background: #fff;
  max-width: 50%;
  width: 50%;
  float: left;
  height: 100vh;
  overflow-x: scroll;
  overflow-y: scroll;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  &:last-child {
    background: black;
    border-top: 1px solid rgba(255,255,255,0.5);
  }
`

const Main = styled.div`
  padding-left: 60px;
`

const Airline = (props) => {
  const [airline, setAirline] = useState({})
  const [reviews, setReviews] = useState([])
  const [review, setReview] = useState({ title: '', description: '', score: 0 })
  const [error, setError] = useState('')
  const [loaded, setLoaded] = useState(false)

  useEffect(()=> {
    const slug = props.match.params.slug

    axios.get(`/api/v1/airlines/${slug}`)
    .then( (resp) => {
      setAirline(resp.data)
      setReviews(resp.data.included)
      setLoaded(true)
    })
    .catch( data => console.log('Error', data) )
  }, [])

  // Modify text in review form
  const handleChange = (e) => {
    setReview(Object.assign({}, review, {[e.target.name]: e.target.value}))
  }

  // Create a review
  const handleSubmit = (e) => {
    e.preventDefault()

    const airline_id = parseInt(airline.data.id)
    axios.post('/api/v1/reviews', { ...review, airline_id })
    .then( (resp) => {
      setReviews([...reviews, resp.data.data])
      setReview({ title: '', description: '', score: 0 })
    })
    .catch(
      ( (resp) => { console.log('Error', resp) })
    )
  }

  // set score
  const setRating = (score, e) => {
    e.preventDefault()
    setReview({ ...review, score })
  }

  let total, average = 0
  let userReviews

  if (reviews && reviews.length > 0) {
    total = reviews.reduce((total, review) => total + review.attributes.score, 0)
    average = total > 0 ? (parseFloat(total) / parseFloat(reviews.length)) : 0

    userReviews = reviews.map( (review, index) => {
      return (
        <Review
          key={index}
          id={review.id}
          attributes={review.attributes}
        />
      )
    })
  }

  return(
    <Wrapper>
      {
        loaded &&
        <Fragment>
          <Column>
            <Main>
              <Header
                attributes={airline.data.attributes}
                reviews={reviews}
                average={average}
              />
              {userReviews}
            </Main>
          </Column>
          <Column>
            <ReviewForm
              name={airline.data.attributes.name}
              review={review}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              setRating={setRating}
              error={error}
            />
          </Column>
        </Fragment>
      }
    </Wrapper>
  )
}

export default Airline