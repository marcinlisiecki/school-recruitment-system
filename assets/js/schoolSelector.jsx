import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import debounce from 'debounce';

const SchoolItem = ({ school, onProfileSelect }) => {
    return (
        <div className="my-3">
            <div className="d-flex justify-content-between align-items-center">
                <div className="flex-1">
                    <div>
                        <strong>{ school.name }</strong>
                    </div>
                    <div className="small text-muted">
                        { school.address }
                    </div>
                    <div className="small text-muted">
                        { school.zipCode }, { school.city }
                    </div>
                </div>
            </div>
            {
                school.profiles.map((profile) => (
                    <div className="d-flex align-items-center justify-content-between my-1">
                        <div className="flex-1">
                            { profile.name }
                        </div>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => onProfileSelect(school, profile)}>Dodaj</button>
                    </div>
                ))
            }
        </div>
    );
};

const SchoolSelector = () => {

    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchSchools, setSearchSchools] = useState(null);
    const [selectedProfiles, setSelectedProfiles] = useState([]);

    const performQuery = async () => {
        if (query.trim().length > 0) {
            setLoading(true);
            const response = await fetch('/api/schools/search/' + encodeURIComponent(query)).then((r) => r.json());
            setSearchSchools(response);
            setLoading(false);
        } else {
            setSearchSchools(null);
        }
    };

    useEffect(() => { performQuery(); }, [query]);

    const handleQueryChange = debounce(
        (e) => setQuery(e.target.value),
        300
    );

    const addProfile = (profile) => {
        setSelectedProfiles([
            ...selectedProfiles,
            profile,
        ]);
    };

    return (
        <div>
            <input
                type="text"
                defaultValue={query}
                onChange={handleQueryChange}
                className="form-control"
                placeholder="Wyszukaj szkołę..."
            />

            { loading && <div className="d-flex align-items-center justify-content-center py-4">
                <div className="spinner-border"></div>
            </div> }

            { !loading && searchSchools && searchSchools.length === 0 && <p>
                Nie znaleziono szkół.
            </p> }

            { !loading && searchSchools && searchSchools.length > 0 && searchSchools.map(
                (school) => (
                    <SchoolItem
                        school={school}
                        onProfileSelect={(school, profile) => {
                            addProfile({ school, profile });
                        }}
                        key={school._id}
                    />
                )
            ) }

            { selectedProfiles.length > 0 && <section className="mt-5">
                <header>
                    <h4>Wybrane</h4>
                </header>

                { selectedProfiles.map(({ school, profile }, i) => (
                    <div className="my-3" key={profile._id}>
                        <input type="hidden" name={`profiles[${i}][_id]`} value={profile._id}/>
                        <input type="hidden" name={`profiles[${i}][school]`} value={school._id}/>

                        <div>
                            <strong>{ school.name } - { profile.name }</strong>
                        </div>

                        <div>
                            { profile.criteria.map((criterion) => (
                                <div className="form-field" key={i}>
                                    <label htmlFor={`profile${profile._id}criterion${criterion._id}Field`} className="form-label">{ criterion.name }</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Wartość"
                                        name={`profiles[${i}][criteriaSubmission][${criterion._id}]`}
                                        id={`profile${profile._id}criterion${criterion._id}Field`}
                                    />
                                </div>
                            )) }
                        </div>
                    </div>
                )) }
            </section> }

        </div>
    );
};

const element = document.getElementById('schoolSelector');

if (element) {
    ReactDOM.render(<SchoolSelector />, element);
}