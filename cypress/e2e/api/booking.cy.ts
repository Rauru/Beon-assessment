describe(' Create and authenticate books',()=>{

  const book={
        "firstname" : "Jim",
      "lastname" : "Brown",
      "totalprice" : 111,
      "depositpaid" : true,
      "bookingdates" : {
          "checkin" : "2018-01-01",
          "checkout" : "2019-01-01"
      },
      "additionalneeds" : "Breakfast"
      }

    const bookUpdated={
        "firstname" : "Jhon",
      "lastname" : "Brown",
      "totalprice" : 111,
      "depositpaid" : true,
      "bookingdates" : {
          "checkin" : "2018-01-01",
          "checkout" : "2019-01-01"
      },
      "additionalneeds" : "Breakfast"
      }
  let bookingID!: number
  let authToken!: string
  const API = 'https://restful-booker.herokuapp.com';
      
  it('Verify authentication', ()=>{
    cy.request({
    method: 'POST',
    url:`${API}/auth`,
    body:{
      username : "admin",
      password : "password123"
    }
  }).then((response)=>{
    expect(response.status).to.eq(200);
    expect(response.body.token).to.be.a('string')
    authToken = response.body.token
  })
  })

  it('Verify authentication token is received',()=>{

    cy.request({
      method:'POST',
      url:`${API}/booking`,
      body:book
    }).then((response)=>{
      expect(response.status).to.eq(200);
      bookingID = response.body.bookingid
    })
  })

  it('Verify GET create and read booking',()=>{
      cy.request({
        method: 'GET',
        url:`${API}/booking/${bookingID}`,
      }).then((response)=>{
        expect(response.status).to.eq(200);
        expect(response.body).to.deep.equal(book)
      })
  })

  it('Update booking with PUT',()=>{
    cy.request({
        method: 'PUT',
        url:`https://restful-booker.herokuapp.com/booking/${bookingID}`,
        headers:{Cookie: `token=${authToken}`},
        body:bookUpdated
      }).then((response)=>{
        expect(response.status).to.eq(200);
        expect(response.body).to.deep.equal(bookUpdated)
      })
  })

  it('Delete a booking',()=>{
    cy.request({
      method:'DELETE',
      url: `${API}/booking/${bookingID}`,
      headers:{ Cookie: `token=${authToken}`},
    }).then((response)=>{
      expect(response.status).to.eq(201);

      cy.request({
        url: `${API}/booking/${bookingID}`,
        failOnStatusCode: false
      }).then((response)=>{
        expect(response.status).to.eq(404);
      })
    })
  })

  

})