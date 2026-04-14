import { MapPin, Phone, Mail } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#0f1220] text-white py-16">
        <div className="max-w-4xl mx-auto px-8">
          <h1 className="text-4xl font-bold mb-4">About Afri Sol – La Divinité LTD</h1>
          <p className="text-xl text-white/80">
            Your trusted digital recharge platform for TV and telecom services across Central Africa
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-8 py-16">
        
        {/* Company Information */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Information</h2>
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Afri Sol – La Divinité LTD</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="text-[#b4f75f] mt-1" size={20} />
                <div>
                  <p className="font-medium text-gray-900">Registered Office Address:</p>
                  <p className="text-gray-700">
                    Kigali, Rwanda, Nyarubande, Mbugangari, Gisenyi, Rubavu, Iburengerazuba
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="text-[#b4f75f]" size={20} />
                <div>
                  <p className="font-medium text-gray-900">Phone:</p>
                  <a href="tel:+250780115764" className="text-blue-600 hover:underline">
                    +250 780 115 764
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="text-[#b4f75f]" size={20} />
                <div>
                  <p className="font-medium text-gray-900">Email:</p>
                  <a href="mailto:laurierhab@gmail.com" className="text-blue-600 hover:underline">
                    laurierhab@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Our Services */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Services</h2>
          <div className="prose prose-lg text-gray-700">
            <p className="mb-4">
              Afri Sol – La Divinité LTD is a leading digital platform providing convenient 
              recharge services for television and telecommunications across Central Africa.
            </p>
            <p className="mb-4">
              We specialize in:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Canal+ subscription renewals</li>
              <li>DStv account top-ups</li>
              <li>Mobile credit for Vodacom, Airtel, and Orange</li>
              <li>Internet package purchases</li>
              <li>24/7 WhatsApp customer support</li>
            </ul>
            <p>
              Our mission is to make digital services accessible and convenient for customers 
              throughout Rwanda, DRC, and Burundi through our automated WhatsApp platform.
            </p>
          </div>
        </section>

        {/* Coverage Areas */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Coverage</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Rwanda</h3>
              <p className="text-gray-600">Complete coverage nationwide</p>
            </div>
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <h3 className="font-semibold text-gray-900 mb-2">DRC</h3>
              <p className="text-gray-600">Major cities and regions</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-6 text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Burundi</h3>
              <p className="text-gray-600">Expanding coverage</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}