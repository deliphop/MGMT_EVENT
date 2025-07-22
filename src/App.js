import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Phone, Mail, Car, Train, Navigation, Download, ChevronLeft, ChevronRight, X, Settings, Plus, Edit3, Trash2, Search } from 'lucide-react';

const ExecutiveTravelDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const [events, setEvents] = useState({
    '2025-07-21': [
      {
        id: 1,
        title: "Réunion Strategic Partnership",
        time: "09:00",
        duration: "2h",
        location: "The Shard, London",
        coordinates: { lat: 51.5045, lng: -0.0865 },
        address: "32 London Bridge St, London SE1 9SG",
        contacts: [
          { name: "James Wilson", phone: "+44 20 7946 0958", email: "j.wilson@techcorp.uk" },
          { name: "Sarah Mitchell", phone: "+44 20 7946 0959", email: "s.mitchell@techcorp.uk" }
        ],
        image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop",
        description: "Négociation partenariat stratégique pour l'expansion européenne",
        type: "business"
      },
      {
        id: 2,
        title: "Déjeuner Client - FinanceGroup",
        time: "12:30",
        duration: "1h30",
        location: "Sketch Restaurant, London",
        coordinates: { lat: 51.5152, lng: -0.1419 },
        address: "9 Conduit St, Mayfair, London W1S 2XG",
        contacts: [
          { name: "Oliver Thompson", phone: "+44 20 7659 4500", email: "o.thompson@financegroup.co.uk" }
        ],
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
        description: "Présentation des solutions financières innovantes",
        type: "client"
      },
      {
        id: 3,
        title: "Conférence Tech Innovation",
        time: "15:30",
        duration: "3h",
        location: "Excel London",
        coordinates: { lat: 51.5081, lng: 0.0294 },
        address: "One Western Gateway, Royal Victoria Dock, London E16 1XL",
        contacts: [
          { name: "David Clarke", phone: "+44 20 7069 5000", email: "d.clarke@excelevents.com" }
        ],
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
        description: "Keynote sur l'IA et transformation digitale",
        type: "conference"
      }
    ],
    '2025-07-22': [
      {
        id: 4,
        title: "Board Meeting",
        time: "10:00",
        duration: "4h",
        location: "Canary Wharf, London",
        coordinates: { lat: 51.5054, lng: -0.0235 },
        address: "1 Canada Square, Canary Wharf, London E14 5AB",
        contacts: [
          { name: "Victoria Adams", phone: "+44 20 7418 8888", email: "v.adams@globalcorp.com" },
          { name: "Michael Brown", phone: "+44 20 7418 8889", email: "m.brown@globalcorp.com" }
        ],
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
        description: "Conseil d'administration trimestriel",
        type: "board"
      },
      {
        id: 5,
        title: "Networking Event",
        time: "18:00",
        duration: "2h",
        location: "Sky Garden, London",
        coordinates: { lat: 51.5112, lng: -0.0834 },
        address: "1 Sky Garden Walk, London EC3M 8AF",
        contacts: [
          { name: "Emma Johnson", phone: "+44 20 7337 2344", email: "e.johnson@skygarden.london" }
        ],
        image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
        description: "Événement networking avec les leaders tech européens",
        type: "networking"
      }
    ],
    '2025-07-23': [
      {
        id: 6,
        title: "Investor Meeting",
        time: "11:00",
        duration: "2h",
        location: "City of London",
        coordinates: { lat: 51.5156, lng: -0.0919 },
        address: "Guildhall, Gresham St, London EC2V 7HH",
        contacts: [
          { name: "Robert Harris", phone: "+44 20 7606 3030", email: "r.harris@cityinvest.co.uk" }
        ],
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
        description: "Présentation aux investisseurs - Série B",
        type: "investor"
      }
    ]
  });

  const eventTypes = {
    business: { color: "bg-red-900", label: "Business" },
    client: { color: "bg-green-800", label: "Client" },
    conference: { color: "bg-yellow-500", label: "Conférence" },
    board: { color: "bg-purple-700", label: "Board" },
    networking: { color: "bg-blue-400", label: "Networking" },
    investor: { color: "bg-orange-500", label: "Investisseurs" }
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getCurrentDayEvents = () => {
    const dateKey = formatDate(selectedDate);
    return events[dateKey] || [];
  };

  const navigateDay = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + direction);
    setSelectedDate(newDate);
  };

  const generateICS = (event) => {
    const startDate = new Date(`${formatDate(selectedDate)}T${event.time}`);
    const endDate = new Date(startDate.getTime() + (parseInt(event.duration) * 60 * 60 * 1000));
    
    const formatICSDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Executive Calendar//EN
BEGIN:VEVENT
UID:${event.id}@executive-calendar.com
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(startDate)}
DTEND:${formatICSDate(endDate)}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.address}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title.replace(/\s+/g, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Obtenir la position utilisateur
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Géolocalisation refusée, utilisation position par défaut Londres');
          // Position par défaut : Centre de Londres
          setUserLocation({ lat: 51.5074, lng: -0.1278 });
        }
      );
    } else {
      // Position par défaut si géolocalisation non supportée
      setUserLocation({ lat: 51.5074, lng: -0.1278 });
    }
  }, []);

  // Calcul de trajet réel avec OpenStreetMap OSRM
  const calculateRealTravelTime = async (destination, mode = 'driving') => {
    if (!userLocation) return "Position inconnue";
    
    try {
      // OSRM supporte : driving, walking, cycling
      const osrmMode = mode === 'car' ? 'driving' : mode === 'walk' ? 'walking' : 'driving';
      
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/${osrmMode}/${userLocation.lng},${userLocation.lat};${destination.lng},${destination.lat}?overview=false&steps=false`
      );
      
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const durationSeconds = data.routes[0].duration;
        const minutes = Math.round(durationSeconds / 60);
        
        if (minutes < 60) {
          return `${minutes} min`;
        } else {
          const hours = Math.floor(minutes / 60);
          const remainingMinutes = minutes % 60;
          return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
        }
      }
      
      return "Trajet non calculable";
    } catch (error) {
      console.error('Erreur calcul trajet:', error);
      
      // Fallback : estimation approximative basée sur la distance
      const distance = calculateDistance(userLocation, destination);
      if (mode === 'car') {
        return `≈${Math.round(distance * 2)} min`; // ~30 km/h moyenne en ville
      } else if (mode === 'walk') {
        return `≈${Math.round(distance * 12)} min`; // ~5 km/h à pied
      } else {
        return `≈${Math.round(distance * 3)} min`; // ~20 km/h transport public
      }
    }
  };

  // Calcul de distance à vol d'oiseau (fallback)
  const calculateDistance = (start, end) => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (end.lat - start.lat) * Math.PI / 180;
    const dLng = (end.lng - start.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(start.lat * Math.PI / 180) * Math.cos(end.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance en km
  };

  const getTravelTime = (transportMode) => {
    const times = {
      car: "Calcul...",
      public: "Calcul...", 
      walk: "Calcul..."
    };
    return times[transportMode] || "N/A";
  };

  // Composant pour les temps de trajet réels
  const TravelTimeSection = ({ event }) => {
    const [travelTimes, setTravelTimes] = useState({
      car: "Calcul...",
      public: "Calcul...",
      walk: "Calcul..."
    });

    useEffect(() => {
      if (event && userLocation) {
        const calculateAllTimes = async () => {
          // Calcul pour voiture
          const carTime = await calculateRealTravelTime(event.coordinates, 'car');
          
          // Calcul pour à pied
          const walkTime = await calculateRealTravelTime(event.coordinates, 'walk');
          
          // Pour les transports publics, on approxime (OSRM ne supporte pas)
          // On prend 1.5x le temps en voiture + 10 min d'attente
          const publicTime = await calculateRealTravelTime(event.coordinates, 'car').then(carResult => {
            if (carResult && carResult.includes('min')) {
              const carMinutes = parseInt(carResult.match(/\d+/)[0]);
              const publicMinutes = Math.round(carMinutes * 1.5) + 10;
              return publicMinutes < 60 ? `${publicMinutes} min` : 
                     `${Math.floor(publicMinutes/60)}h ${publicMinutes%60}min`;
            }
            return "Non disponible";
          });

          setTravelTimes({
            car: carTime,
            public: publicTime,
            walk: walkTime
          });
        };

        calculateAllTimes();
      }
    }, [event, userLocation]);

    return (
      <div>
        <h4 className="font-medium mb-3">
          Temps de trajet depuis votre position
          {userLocation && (
            <span className="text-xs text-green-600 ml-2">
              📍 {userLocation.lat.toFixed(3)}, {userLocation.lng.toFixed(3)}
            </span>
          )}
        </h4>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <Car className="w-6 h-6 text-gray-600 mx-auto mb-1" />
            <p className="text-sm font-medium">Voiture</p>
            <p className="text-xs text-gray-600 font-mono">{travelTimes.car}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <Train className="w-6 h-6 text-gray-600 mx-auto mb-1" />
            <p className="text-sm font-medium">Transport</p>
            <p className="text-xs text-gray-600 font-mono">{travelTimes.public}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <Navigation className="w-6 h-6 text-gray-600 mx-auto mb-1" />
            <p className="text-sm font-medium">À pied</p>
            <p className="text-xs text-gray-600 font-mono">{travelTimes.walk}</p>
          </div>
        </div>
        
        {!userLocation && (
          <div className="mt-2 text-xs text-orange-600 text-center">
            ⚠️ Autorisez la géolocalisation pour des trajets précis
          </div>
        )}
      </div>
    );
  };

  const EventDetailsModal = () => {
    if (!selectedEvent) return null;

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        style={{ zIndex: 9999 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowEventDetails(false);
            setSelectedEvent(null);
          }
        }}
      >
        <div 
          className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative h-48 overflow-hidden rounded-t-2xl">
            <img 
              src={selectedEvent.image} 
              alt={selectedEvent.location}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <button
              onClick={() => {
                setShowEventDetails(false);
                setSelectedEvent(null);
              }}
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-xl font-bold mb-1">{selectedEvent.title}</h3>
              <p className="text-white/90">{selectedEvent.location}</p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-red-900" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-gray-600">{selectedDate.toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-red-900" />
                  <div>
                    <p className="font-medium">Heure</p>
                    <p className="text-gray-600">{selectedEvent.time} ({selectedEvent.duration})</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-900 mt-1" />
                  <div>
                    <p className="font-medium">Adresse</p>
                    <p className="text-gray-600 text-sm">{selectedEvent.address}</p>
                  </div>
                </div>

                <div className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm ${eventTypes[selectedEvent.type].color}`}>
                  {eventTypes[selectedEvent.type].label}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-gray-600">{selectedEvent.description}</p>
            </div>

            <div>
              <h4 className="font-medium mb-3">Contacts</h4>
              <div className="space-y-3">
                {selectedEvent.contacts.map((contact, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{contact.name}</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <a href={`tel:${contact.phone}`} className="text-red-900 hover:underline">
                          {contact.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <a href={`mailto:${contact.email}`} className="text-red-900 hover:underline">
                          {contact.email}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Temps de trajet réels */}
            <TravelTimeSection event={selectedEvent} />

            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={() => generateICS(selectedEvent)}
                className="flex-1 bg-red-900 text-white py-3 px-4 rounded-lg hover:bg-red-800 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Ajouter à l'agenda
              </button>
              <button
                onClick={() => window.open(`https://maps.google.com/?q=${selectedEvent.address}`, '_blank')}
                className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                Voir sur Maps
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MapView = () => {
    const currentEvents = getCurrentDayEvents();
    const mapRef = useRef(null);
    
    useEffect(() => {
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }
      
      if (!window.L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = initializeMap;
        document.head.appendChild(script);
      } else {
        initializeMap();
      }
    }, [currentEvents]);

    const initializeMap = () => {
      if (!window.L || !mapRef.current) return;
      
      if (mapRef.current._leaflet_id) {
        mapRef.current._leaflet_id = null;
        mapRef.current.innerHTML = '';
      }

      let center = [51.5074, -0.1278];
      let zoom = 12;

      if (currentEvents.length > 0) {
        const lats = currentEvents.map(e => e.coordinates.lat);
        const lngs = currentEvents.map(e => e.coordinates.lng);
        center = [
          lats.reduce((a, b) => a + b) / lats.length,
          lngs.reduce((a, b) => a + b) / lngs.length
        ];
      }

      const map = window.L.map(mapRef.current).setView(center, zoom);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      const getEventColor = (type) => {
        const colorMap = {
          business: '#7c2d12',
          client: '#166534', 
          conference: '#eab308',
          board: '#7c3aed',
          networking: '#60a5fa',
          investor: '#f97316'
        };
        return colorMap[type] || '#7c2d12';
      };

      // Ajouter un marker pour la position utilisateur
      if (userLocation) {
        const userIcon = window.L.divIcon({
          className: 'user-marker',
          html: `
            <div style="
              background-color: #3b82f6;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              border: 3px solid white;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 10px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              position: relative;
            ">
              📍
              <div style="
                position: absolute;
                bottom: -25px;
                left: 50%;
                transform: translateX(-50%);
                background: #3b82f6;
                color: white;
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 10px;
                white-space: nowrap;
                box-shadow: 0 1px 4px rgba(0,0,0,0.3);
              ">
                Votre position
              </div>
            </div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        const userMarker = window.L.marker([userLocation.lat, userLocation.lng], {
          icon: userIcon
        }).addTo(map);

        userMarker.bindPopup(`
          <div style="padding: 8px; text-align: center;">
            <h4 style="margin: 0 0 4px 0; color: #3b82f6; font-weight: bold;">📍 Votre position</h4>
            <p style="margin: 0; font-size: 12px; color: #6b7280;">
              Point de départ pour les calculs de trajet
            </p>
            <p style="margin: 4px 0 0 0; font-size: 10px; color: #9ca3af;">
              ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}
            </p>
          </div>
        `);
      }

      currentEvents.forEach((event, index) => {
        const color = getEventColor(event.type);
        
        const customIcon = window.L.divIcon({
          className: 'custom-marker',
          html: `
            <div style="
              background-color: ${color};
              width: 30px;
              height: 30px;
              border-radius: 50%;
              border: 3px solid white;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 12px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ">
              ${index + 1}
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        const marker = window.L.marker([event.coordinates.lat, event.coordinates.lng], {
          icon: customIcon
        }).addTo(map);

        const popupContent = `
          <div style="min-width: 200px; padding: 8px;">
            <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: bold;">${event.title}</h3>
            <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
              <strong>📍</strong> ${event.location}
            </p>
            <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
              <strong>⏰</strong> ${event.time} (${event.duration})
            </p>
            <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
              <strong>👥</strong> ${event.contacts.length} participant(s)
            </p>
            <div style="margin-top: 8px;">
              <span style="background: ${color}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
                ${eventTypes[event.type].label}
              </span>
            </div>
            <button 
              onclick="window.openEventDetails('${event.id}')" 
              style="margin-top: 8px; background: #7c2d12; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; width: 100%;"
            >
              Voir détails complets
            </button>
          </div>
        `;

        marker.bindPopup(popupContent);
      });

      // Ajuster la vue pour inclure tous les markers + position utilisateur
      if (currentEvents.length > 0) {
        const allPoints = currentEvents.map(event => 
          window.L.marker([event.coordinates.lat, event.coordinates.lng])
        );
        
        // Ajouter la position utilisateur si disponible
        if (userLocation) {
          allPoints.push(window.L.marker([userLocation.lat, userLocation.lng]));
        }
        
        const group = new window.L.featureGroup(allPoints);
        map.fitBounds(group.getBounds().pad(0.1));
      } else if (userLocation) {
        // S'il n'y a pas d'événements mais qu'on a la position utilisateur
        map.setView([userLocation.lat, userLocation.lng], 13);
      }

      window.openEventDetails = (eventId) => {
        const event = currentEvents.find(e => e.id.toString() === eventId);
        if (event) {
          setSelectedEvent(event);
          setShowEventDetails(true);
        }
      };
    };

    return (
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-800">🗺️ Carte interactive</h3>
              <p className="text-sm text-gray-600">{currentEvents.length} RDV aujourd'hui</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {Object.entries(eventTypes).slice(0, 4).map(([key, type]) => (
                <div key={key} className="flex items-center gap-1">
                  <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                  <span className="text-xs text-gray-600">{type.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div 
          ref={mapRef} 
          className="h-96 w-full"
          style={{ minHeight: '400px' }}
        />

        <div className="p-3 bg-gray-50 text-xs text-gray-600 text-center">
          🌍 Carte mondiale OpenStreetMap • 📍 Position bleue = votre localisation • 🚗 Trajets calculés en temps réel
        </div>
      </div>
    );
  };

  const AdminPage = () => {
    const geocodeLocation = async (locationName) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}&limit=1`
        );
        const data = await response.json();
        
        if (data && data.length > 0) {
          return {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
            display_name: data[0].display_name
          };
        }
        return null;
      } catch (error) {
        console.error('Erreur géocodage:', error);
        return null;
      }
    };

    const EventForm = ({ event, onSave, onCancel }) => {
      const [formData, setFormData] = useState(event || {
        title: '',
        time: '',
        duration: '',
        location: '',
        address: '',
        contacts: [{ name: '', phone: '', email: '' }],
        image: '',
        description: '',
        type: 'business',
        coordinates: { lat: 51.5074, lng: -0.1278 }
      });
      
      const [locationSuggestions, setLocationSuggestions] = useState([]);
      const [isSearching, setIsSearching] = useState(false);
      const [locationFound, setLocationFound] = useState(false);

      const searchLocation = async (query) => {
        if (query.length < 3) {
          setLocationSuggestions([]);
          return;
        }

        setIsSearching(true);
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
          );
          const data = await response.json();
          
          const suggestions = data.map(item => ({
            display_name: item.display_name,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            name: item.name || item.display_name.split(',')[0]
          }));
          
          setLocationSuggestions(suggestions);
        } catch (error) {
          console.error('Erreur recherche lieu:', error);
        } finally {
          setIsSearching(false);
        }
      };

      const selectLocation = (suggestion) => {
        setFormData({
          ...formData,
          location: suggestion.name,
          address: suggestion.display_name,
          coordinates: { lat: suggestion.lat, lng: suggestion.lng }
        });
        setLocationSuggestions([]);
        setLocationFound(true);
      };

      const handleLocationChange = (value) => {
        setFormData({ ...formData, location: value });
        setLocationFound(false);
        
        clearTimeout(window.searchTimeout);
        window.searchTimeout = setTimeout(() => {
          searchLocation(value);
        }, 500);
      };

      const handleContactChange = (index, field, value) => {
        const newContacts = [...formData.contacts];
        newContacts[index] = { ...newContacts[index], [field]: value };
        setFormData({ ...formData, contacts: newContacts });
      };

      const addContact = () => {
        setFormData({
          ...formData,
          contacts: [...formData.contacts, { name: '', phone: '', email: '' }]
        });
      };

      const removeContact = (index) => {
        const newContacts = formData.contacts.filter((_, i) => i !== index);
        setFormData({ ...formData, contacts: newContacts });
      };

      const handleSave = () => {
        if (!formData.title || !formData.time || !formData.location) {
          alert('Veuillez remplir tous les champs obligatoires');
          return;
        }
        onSave(formData);
      };

      return (
        <div className="bg-white rounded-xl p-6 max-h-[80vh] overflow-y-auto">
          <h3 className="text-xl font-bold mb-6">
            {event ? 'Modifier l\'événement' : 'Nouvel événement'}
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Titre *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                  placeholder="Titre du rendez-vous"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900"
                >
                  {Object.entries(eventTypes).map(([key, type]) => (
                    <option key={key} value={key}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Heure *</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Durée</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900"
                  placeholder="ex: 2h, 1h30"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium mb-2">
                Lieu * 
                {locationFound && <span className="text-green-600 ml-2">✓ Trouvé sur la carte</span>}
                {isSearching && <span className="text-blue-600 ml-2">🔍 Recherche...</span>}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent pr-10"
                  placeholder="Ex: Tour Eiffel, Paris ou The Shard, London"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              
              {locationSuggestions.length > 0 && (
                <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto" style={{ zIndex: 10000 }}>
                  {locationSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => selectLocation(suggestion)}
                    >
                      <div className="font-medium text-sm">{suggestion.name}</div>
                      <div className="text-xs text-gray-600 mt-1">{suggestion.display_name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Adresse complète</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 bg-gray-50"
                placeholder="Sera remplie automatiquement lors de la sélection du lieu"
                readOnly={locationFound}
              />
            </div>

            {formData.coordinates && formData.coordinates.lat !== 51.5074 && (
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-sm text-green-800">
                  📍 <strong>Coordonnées trouvées:</strong> 
                  <br />
                  Latitude: {formData.coordinates.lat.toFixed(6)}
                  <br />
                  Longitude: {formData.coordinates.lng.toFixed(6)}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">URL de l'image</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 h-20"
                placeholder="Description du rendez-vous"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Contacts</label>
              {formData.contacts.map((contact, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Contact {index + 1}</h4>
                    {formData.contacts.length > 1 && (
                      <button
                        onClick={() => removeContact(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={contact.name}
                      onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                      placeholder="Nom complet"
                      className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-900"
                    />
                    <input
                      type="tel"
                      value={contact.phone}
                      onChange={(e) => handleContactChange(index, 'phone', e.target.value)}
                      placeholder="Téléphone"
                      className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-900"
                    />
                    <input
                      type="email"
                      value={contact.email}
                      onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                      placeholder="Email"
                      className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-900"
                    />
                  </div>
                </div>
              ))}
              
              <button
                onClick={addContact}
                className="text-red-900 hover:text-red-700 text-sm font-medium"
              >
                + Ajouter un contact
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t mt-6">
            <button
              onClick={handleSave}
              className="flex-1 bg-red-900 text-white py-3 px-4 rounded-lg hover:bg-red-800 transition-colors"
            >
              {event ? 'Modifier' : 'Créer'}
            </button>
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      );
    };

    const allEvents = Object.entries(events).flatMap(([date, dayEvents]) => 
      dayEvents.map(event => ({ ...event, date }))
    );

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Administration
                </h1>
                <p className="text-gray-600">
                  Gestion des événements et rendez-vous
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowEventForm(true)}
                  className="bg-red-900 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Nouvel événement
                </button>
                <button
                  onClick={() => setShowAdmin(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Retour
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Tous les événements ({allEvents.length})</h2>
            
            {allEvents.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Aucun événement</p>
                <p className="text-sm">Créez votre premier événement</p>
              </div>
            ) : (
              <div className="space-y-4">
                {allEvents
                  .sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time))
                  .map((event) => (
                    <div key={`${event.date}-${event.id}`} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{event.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs text-white ${eventTypes[event.type].color}`}>
                              {eventTypes[event.type].label}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {new Date(event.date).toLocaleDateString('fr-FR')}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {event.time} ({event.duration})
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {event.location}
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              {event.contacts.length} contact(s)
                            </div>
                          </div>
                          
                          {event.description && (
                            <p className="text-sm text-gray-600 mt-2 italic">"{event.description}"</p>
                          )}
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => {
                              setEditingEvent(event);
                              setShowEventForm(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
                                const dateKey = event.date;
                                const newEvents = { ...events };
                                newEvents[dateKey] = newEvents[dateKey].filter(e => e.id !== event.id);
                                if (newEvents[dateKey].length === 0) {
                                  delete newEvents[dateKey];
                                }
                                setEvents(newEvents);
                              }
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {showEventForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
            <EventForm
              event={editingEvent}
              onSave={(formData) => {
                const dateKey = formatDate(selectedDate);
                if (editingEvent) {
                  const oldDateKey = editingEvent.date;
                  const newEvents = { ...events };
                  
                  newEvents[oldDateKey] = newEvents[oldDateKey].filter(e => e.id !== editingEvent.id);
                  if (newEvents[oldDateKey].length === 0) {
                    delete newEvents[oldDateKey];
                  }
                  
                  if (!newEvents[dateKey]) newEvents[dateKey] = [];
                  newEvents[dateKey].push({ ...formData, id: editingEvent.id });
                  
                  setEvents(newEvents);
                } else {
                  const newEvents = { ...events };
                  if (!newEvents[dateKey]) newEvents[dateKey] = [];
                  newEvents[dateKey].push({ ...formData, id: Date.now() });
                  setEvents(newEvents);
                }
                
                setShowEventForm(false);
                setEditingEvent(null);
              }}
              onCancel={() => {
                setShowEventForm(false);
                setEditingEvent(null);
              }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {showAdmin ? (
        <AdminPage />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Agenda Business International
                  </h1>
                  <p className="text-gray-600">
                    Gestion des déplacements et rendez-vous
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowAdmin(true)}
                    className="bg-red-900 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Admin
                  </button>
                  
                  <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-2">
                    <button
                      onClick={() => navigateDay(-1)}
                      className="p-2 hover:bg-white rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="text-center px-4">
                      <p className="font-semibold text-lg">
                        {selectedDate.toLocaleDateString('fr-FR', { 
                          weekday: 'long', 
                          day: 'numeric',
                          month: 'long'
                        })}
                      </p>
                      <p className="text-sm text-gray-600">
                        {getCurrentDayEvents().length} RDV
                      </p>
                    </div>
                    
                    <button
                      onClick={() => navigateDay(1)}
                      className="p-2 hover:bg-white rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <MapView />
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    Planning du jour
                  </h3>
                  
                  {getCurrentDayEvents().length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Aucun RDV prévu</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {getCurrentDayEvents()
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map((event) => (
                          <div
                            key={event.id}
                            className="border-l-4 border-red-900 bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                            onClick={() => {
                              setSelectedEvent(event);
                              setShowEventDetails(true);
                            }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-gray-800">{event.title}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs text-white ${eventTypes[event.type].color}`}>
                                {eventTypes[event.type].label}
                              </span>
                            </div>
                            
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{event.time} ({event.duration})</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>{event.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                <span>{event.contacts.length} participant(s)</span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    Aperçu semaine
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(events).map(([date, dayEvents]) => {
                      const eventDate = new Date(date);
                      const isToday = formatDate(eventDate) === formatDate(selectedDate);
                      
                      return (
                        <div
                          key={date}
                          className={`flex justify-between items-center p-2 rounded-lg cursor-pointer transition-colors ${
                            isToday ? 'bg-red-900 text-white' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedDate(eventDate)}
                        >
                          <span className="text-sm">
                            {eventDate.toLocaleDateString('fr-FR', { 
                              weekday: 'short', 
                              day: 'numeric',
                              month: 'short'
                            })}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            isToday ? 'bg-white/20' : 'bg-gray-200'
                          }`}>
                            {dayEvents.length} RDV
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showEventDetails && <EventDetailsModal />}
        </div>
      )}
    </>
  );
};

export default ExecutiveTravelDashboard;