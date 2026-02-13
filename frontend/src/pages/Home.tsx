import Header from '../components/Header';
import LinkForm from '../components/LinkForm';
import LinkList from '../components/LinkList';

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            
            <div className="container mx-auto px-4 py-8">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-4">Создать короткую ссылку</h2>
                        <LinkForm onLinkCreated={() => window.location.reload()} />
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-4">Мои ссылки</h2>
                        <LinkList />
                    </div>
                </div>
            </div>
        </div>
    );
}