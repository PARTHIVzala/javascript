import { useState } from "react";
import "./app.css";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");
  const [image, setImage] = useState(null);
  const [reviews, setReviews] = useState([]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (!name || !email || !rating || !review) {
      alert("Please fill all fields");
      return;
    }

    const newReview = {
      name,
      email,
      rating,
      review,
      image,
    };

    setReviews([...reviews, newReview]);

    // clear form
    setName("");
    setEmail("");
    setRating("");
    setReview("");
    setImage(null);
  };

  return (
    <>
      {/* Review Form */}
      <div className="review-container">
        <h2>Add Your Review</h2>

        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="number"
          placeholder="Rating (1-5)"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />

        <input type="file" accept="image/*" onChange={handleImageUpload} />

        <textarea
          placeholder="Your Review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />

        <button onClick={handleSubmit}>Submit</button>
      </div>

      {/* Review List */}
      <h3 className="review-list-title">Review List</h3>

      <div className="review-list">
        {reviews.map((item, index) => (
          <div className="review-card" key={index}>
            <div className="image-box">
              {item.image ? (
                <img
                  src={item.image}
                  alt="profile"
                  className="profile-pic"
                />
              ) : (
                <div className="no-image">No Image</div>
              )}
            </div>

            <div className="review-content">
              <h4>{item.name}</h4>
              <p className="email">{item.email}</p>
              <p className="rating">{"⭐".repeat(item.rating)}</p>
              <p className="comment">{item.review}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
