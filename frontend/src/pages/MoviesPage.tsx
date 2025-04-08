import { useState } from "react";
import AuthorizeView, { AuthorizedUser } from "../components/AuthorizeView";
import Header from "../components/Header";
import Logout from "../components/Logout";
import ContainerFilter from "../components/ContainerFilter";
import CompetitionList from "../components/CompetitionList";
import "./MoviesPage.css"; // new css file for layout

function CompetitionPage() {
  const [selectedContainers, setSelectedContainers] = useState<string[]>([]);

  return (
    <AuthorizeView>
      <div className="movies-page">
        <div className="logout-bar">
          <Logout>
            Logout <AuthorizedUser value="email" />
          </Logout>
        </div>

        <Header />

        <div className="filter-row">
          <ContainerFilter
            selectedContainers={selectedContainers}
            setSelectedContainers={setSelectedContainers}
          />
        </div>

        <div className="movie-section">
          <CompetitionList selectedContainers={selectedContainers} />
        </div>
      </div>
    </AuthorizeView>
  );
}

export default CompetitionPage;
