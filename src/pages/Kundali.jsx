import { useState } from "react";
import { FiHeart } from "react-icons/fi";
import "./Kundali.css";
import Footer from "../components/Footer";

export default function Kundali() {
  const empty = {
    year: "",
    month: "",
    date: "",
    hours: "",
    minutes: "",
    latitude: "",
    longitude: "",
  };

  const [female, setFemale] = useState(empty);
  const [male, setMale] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e, type) => {
    const { name, value } = e.target;
    type === "female"
      ? setFemale({ ...female, [name]: value })
      : setMale({ ...male, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(
        "https://json.freeastrologyapi.com/match-making/ashtakoot-score",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "YOUR_API_KEY_HERE",
          },
          body: JSON.stringify({
            female: { ...female, seconds: 0, timezone: 5.5 },
            male: { ...male, seconds: 0, timezone: 5.5 },
            config: {
              observation_point: "topocentric",
              language: "te",
              ayanamsha: "lahiri",
            },
          }),
        },
      );

      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Error fetching score");
    }

    setLoading(false);
  };

  const renderInputs = (person, type) =>
    Object.keys(person).map((key) => (
      <input
        key={key}
        name={key}
        placeholder={key}
        value={person[key]}
        onChange={(e) => handleChange(e, type)}
        required
      />
    ));

  return (
    <>
      <div className="kundli-section">
        <div className="match-card">
          <h2>❤️ Kundli Match Making</h2>

          <form onSubmit={handleSubmit}>
            <div className="forms">
              <div className="person">
                <h3>Bride Details</h3>
                {renderInputs(female, "female")}
              </div>

              <div className="person">
                <h3>Groom Details</h3>
                {renderInputs(male, "male")}
              </div>
            </div>

            <button className="match-btn">
              {loading ? (
                "Calculating..."
              ) : (
                <>
                  <FiHeart /> Match Now
                </>
              )}
            </button>
          </form>

          {loading && <div className="loader"></div>}

          {result && (
            <div className="result-card">
              <h3>Compatibility Score</h3>
              <p className="score">{result?.total_score || "—"} / 36</p>
            </div>
          )}
        </div>
      </div>
      <Footer/>
    </>
  );
}
