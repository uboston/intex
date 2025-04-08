import { useEffect, useState } from 'react';
import './ContainerFilter.css';

function ContainerFilter({
  selectedContainers,
  setSelectedContainers,
}: {
  selectedContainers: string[];
  setSelectedContainers: (containers: string[]) => void;
}) {
  const [containers, setContainers] = useState<string[]>([]);

  useEffect(() => {
    const fetchContainers = async () => {
      try {
        const response = await fetch(
          'https://localhost:5000/Competition/GetContainerTypes',
          {
            credentials: 'include',
          }
        );

        const data = await response.json();
        setContainers(data);
        setSelectedContainers(data); // Automatically select all initially
      } catch (error) {
        console.error('Error fetching container types', error);
      }
    };
    fetchContainers();
  }, [setSelectedContainers]);

  function handleCheckboxChange({ target }: { target: HTMLInputElement }) {
    const updatedContainers = selectedContainers.includes(target.value)
      ? selectedContainers.filter((x) => x !== target.value)
      : [...selectedContainers, target.value];

    setSelectedContainers(updatedContainers);
  }

  return (
    <div className="container-filter movies-container-filter">
      <h5 className="filter-title">Container Types</h5>
      <div className="container-list filter-carousel">
        {containers.map((c) => (
          <div key={c} className="container-item filter-item">
            <input
              type="checkbox"
              id={c}
              name={c}
              value={c}
              className="container-checkbox"
              onChange={handleCheckboxChange}
              checked={selectedContainers.includes(c)}
            />
            <label htmlFor={c}>{c}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContainerFilter;

